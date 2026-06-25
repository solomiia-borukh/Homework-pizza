import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { ItemsListComponent } from '@/app/widgets/items-list'

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

const makeItemsResponse = (
  overrides: Partial<{
    items: unknown[]
    total: number
    totalPages: number
    page: number
  }> = {},
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
    total: 2,
    page: 1,
    totalPages: 1,
    ...overrides,
  })

let searchParamsStore = new URLSearchParams()
const mockPush = vi.fn()

const renderList = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )

  return { ...render(<ItemsListComponent />, { wrapper: Wrapper }), client }
}

beforeEach(() => {
  searchParamsStore = new URLSearchParams()
  vi.mocked(useSearchParams).mockImplementation(
    () => searchParamsStore as ReturnType<typeof useSearchParams>,
  )
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
  } as unknown as ReturnType<typeof useRouter>)
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/favorites')) {
      return Promise.resolve(makeJsonResponse({ itemIds: [] }))
    }

    return Promise.resolve(makeItemsResponse())
  })
})

describe('Integration | Component | ItemsList', () => {
  test('it shows a loading skeleton while fetching', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}))

    renderList()

    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(6)
  })

  test('it renders pizza cards after data loads', async () => {
    renderList()

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: 'Margherita' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'Pepperoni' }),
      ).toBeInTheDocument()
      expect(screen.getAllByRole('heading').length).toEqual(2)

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument()
        expect(screen.getByText('7')).toBeInTheDocument()
      })
    })
  })

  test('it shows "No pizzas found" when the response is empty', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/favorites')) {
        return Promise.resolve(makeJsonResponse({ itemIds: [] }))
      }

      return Promise.resolve(
        makeItemsResponse({ items: [], total: 0, totalPages: 0 }),
      )
    })

    renderList()

    await waitFor(() => {
      expect(screen.getByText('No pizzas found')).toBeInTheDocument()
    })
  })

  test('it renders pagination when there are multiple pages', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/favorites')) {
        return Promise.resolve(makeJsonResponse({ itemIds: [] }))
      }

      return Promise.resolve(makeItemsResponse({ total: 12, totalPages: 2 }))
    })

    renderList()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    })
  })

  test('it pushes a new URL when the user clicks a pagination page', async () => {
    const user = userEvent.setup()

    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/favorites')) {
        return Promise.resolve(makeJsonResponse({ itemIds: [] }))
      }

      return Promise.resolve(makeItemsResponse({ total: 12, totalPages: 2 }))
    })

    renderList()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '2' }))

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=2'))
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

      rerender(<ItemsListComponent />)

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

      rerender(<ItemsListComponent />)

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
        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeJsonResponse({ itemIds: [] }))
        }

        if (url.includes('term=pepperoni')) {
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
              total: 1,
              page: 1,
              totalPages: 1,
            }),
          )
        }

        return Promise.resolve(makeItemsResponse())
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

      rerender(<ItemsListComponent />)

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
