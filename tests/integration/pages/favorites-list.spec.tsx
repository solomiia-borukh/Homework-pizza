import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { FavoritesList } from '@/app/widgets/favorites-list'

const fetchMock = vi.hoisted(() => {
  const mock = vi.fn()

  vi.stubGlobal('fetch', mock)

  return mock
})

vi.mock('next/navigation')
vi.mock('next/image')
vi.mock('@/pkg/auth/auth-client', () => ({
  useSession: () => ({ data: null }),
}))

const makeJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const makeFavoriteItemsResponse = (
  overrides: Partial<{ items: unknown[] }> = {},
) =>
  makeJsonResponse({
    items: [
      {
        id: '1',
        title: 'Margherita',
        description: 'Classic',
        imageUrl: null,
        createdAt: '2024-01-01T00:00:00Z',
        favoritesCount: 3,
      },
      {
        id: '2',
        title: 'Pepperoni',
        description: 'Spicy',
        imageUrl: null,
        createdAt: '2024-01-02T00:00:00Z',
        favoritesCount: 7,
      },
    ],
    ...overrides,
  })

let searchParamsStore = new URLSearchParams()

const renderList = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )

  return { ...render(<FavoritesList />, { wrapper: Wrapper }), client }
}

beforeEach(() => {
  searchParamsStore = new URLSearchParams()
  vi.mocked(useSearchParams).mockImplementation(
    () => searchParamsStore as ReturnType<typeof useSearchParams>,
  )
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/favorites/items')) {
      return Promise.resolve(makeFavoriteItemsResponse())
    }

    if (url.includes('/api/favorites')) {
      return Promise.resolve(makeJsonResponse({ itemIds: [] }))
    }

    return Promise.resolve(makeJsonResponse({}))
  })
})

describe('Integration | Component | FavoritesList', () => {
  test('it shows a loading skeleton while fetching', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}))

    renderList()

    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(6)
  })

  test('it renders favorited pizza cards after data loads', async () => {
    renderList()

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Margherita' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'Pepperoni' }),
      ).toBeInTheDocument()
    })
  })

  test('it shows "No favorites yet" when the response is empty', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/favorites/items')) {
        return Promise.resolve(makeFavoriteItemsResponse({ items: [] }))
      }

      if (url.includes('/api/favorites')) {
        return Promise.resolve(makeJsonResponse({ itemIds: [] }))
      }

      return Promise.resolve(makeJsonResponse({}))
    })

    renderList()

    await waitFor(() => {
      expect(screen.getByText('No favorites yet')).toBeInTheDocument()
    })
  })

  describe('Cache', () => {
    test('it does not re-fetch when re-rendered with the same search params', async () => {
      const { rerender } = renderList()

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Margherita' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockClear()

      rerender(<FavoritesList />)

      expect(fetchMock).not.toHaveBeenCalled()
    })

    test('it re-fetches when search params change', async () => {
      const { rerender } = renderList()

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Margherita' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockClear()

      searchParamsStore = new URLSearchParams('term=pepperoni')
      vi.mocked(useSearchParams).mockImplementation(
        () => searchParamsStore as ReturnType<typeof useSearchParams>,
      )

      rerender(<FavoritesList />)

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('term=pepperoni'),
        )
      })
    })
  })

  describe('Combined search flow', () => {
    test('it updates the list when the term param changes', async () => {
      fetchMock.mockImplementation((url: string) => {
        if (
          url.includes('/api/favorites/items') &&
          url.includes('term=pepperoni')
        ) {
          return Promise.resolve(
            makeJsonResponse({
              items: [
                {
                  id: '2',
                  title: 'Pepperoni',
                  description: 'Spicy',
                  imageUrl: null,
                  createdAt: '2024-01-02T00:00:00Z',
                  favoritesCount: 7,
                },
              ],
            }),
          )
        }

        if (url.includes('/api/favorites/items')) {
          return Promise.resolve(makeFavoriteItemsResponse())
        }

        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeJsonResponse({ itemIds: [] }))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      const { rerender } = renderList()

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Margherita' }),
        ).toBeInTheDocument()
      })

      searchParamsStore = new URLSearchParams('term=pepperoni')
      vi.mocked(useSearchParams).mockImplementation(
        () => searchParamsStore as ReturnType<typeof useSearchParams>,
      )

      rerender(<FavoritesList />)

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Pepperoni' }),
        ).toBeInTheDocument()
        expect(
          screen.queryByRole('heading', { name: 'Margherita' }),
        ).not.toBeInTheDocument()
      })
    })
  })
})
