import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSearchParams } from 'next/navigation'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import {
  FavoriteCount,
  ToggleFavoriteButton,
} from '@/app/features/toggle-favorite'

const fetchMock = vi.hoisted(() => {
  const mock = vi.fn()

  vi.stubGlobal('fetch', mock)

  return mock
})

const mockUseSession = vi.hoisted(() => vi.fn())

vi.mock('next/navigation')
vi.mock('@/pkg/auth/auth-client', () => ({
  useSession: mockUseSession,
}))

const MOCK_SESSION = { user: { id: 'user-1', email: 'test@example.com' } }
const ITEM_ID = 'pizza-1'
const INITIAL_COUNT = 7

const makeJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const makeFavoritesResponse = (itemIds: string[]) =>
  makeJsonResponse({ itemIds })

const renderCombined = (initialFavorited = false) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )

  fetchMock.mockImplementation((url: string, init?: RequestInit) => {
    if (url.includes('/api/favorites') && init?.method === 'POST') {
      return Promise.resolve(makeJsonResponse({ ok: true }))
    }

    if (url.includes('/api/favorites') && init?.method === 'DELETE') {
      return Promise.resolve(makeJsonResponse({ ok: true }))
    }

    if (url.includes('/api/favorites')) {
      return Promise.resolve(
        makeFavoritesResponse(initialFavorited ? [ITEM_ID] : []),
      )
    }

    return Promise.resolve(makeJsonResponse({}))
  })

  return {
    ...render(
      <div style={{ position: 'relative' }}>
        <ToggleFavoriteButton itemId={ITEM_ID} />
        <FavoriteCount itemId={ITEM_ID} initialCount={INITIAL_COUNT} />
      </div>,
      { wrapper: Wrapper },
    ),
    client,
  }
}

beforeEach(() => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams() as ReturnType<typeof useSearchParams>,
  )
  mockUseSession.mockReturnValue({ data: MOCK_SESSION })
})

describe('Integration | Component | FavoriteCount', () => {
  test('it shows initialCount on render', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}))

    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: { queries: { retry: false } },
          })
        }
      >
        <FavoriteCount itemId={ITEM_ID} initialCount={INITIAL_COUNT} />
      </QueryClientProvider>,
    )

    expect(screen.getByText(String(INITIAL_COUNT))).toBeInTheDocument()
  })

  describe('First favorites load', () => {
    test('it does not adjust the count when the item was already favorited on load', async () => {
      renderCombined(true)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove from favorites' }),
        ).toBeInTheDocument()
      })

      expect(screen.getByText(String(INITIAL_COUNT))).toBeInTheDocument()
    })

    test('it does not adjust the count when the item was not favorited on load', async () => {
      renderCombined()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })

      expect(screen.getByText(String(INITIAL_COUNT))).toBeInTheDocument()
    })
  })

  describe('Optimistic count update', () => {
    test('it increments the count when the user adds the item to favorites', async () => {
      const user = userEvent.setup()

      renderCombined()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'POST') {
          return Promise.resolve(makeJsonResponse({ ok: true }))
        }

        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeFavoritesResponse([ITEM_ID]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

      await waitFor(() => {
        expect(screen.getByText(String(INITIAL_COUNT + 1))).toBeInTheDocument()
      })
    })

    test('it decrements the count when the user removes the item from favorites', async () => {
      const user = userEvent.setup()

      renderCombined(true)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove from favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'DELETE') {
          return Promise.resolve(makeJsonResponse({ ok: true }))
        }

        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeFavoritesResponse([]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      await user.click(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      )

      await waitFor(() => {
        expect(screen.getByText(String(INITIAL_COUNT - 1))).toBeInTheDocument()
      })
    })
  })

  describe('Rollback on error', () => {
    test('it reverts the count when a POST fails', async () => {
      const user = userEvent.setup()

      renderCombined()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'POST') {
          return Promise.resolve(
            makeJsonResponse({ error: 'Server error' }, 500),
          )
        }

        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeFavoritesResponse([]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

      await waitFor(() => {
        expect(screen.getByText(String(INITIAL_COUNT))).toBeInTheDocument()
      })
    })

    test('it reverts the count when a DELETE fails', async () => {
      const user = userEvent.setup()

      renderCombined(true)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove from favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'DELETE') {
          return Promise.resolve(
            makeJsonResponse({ error: 'Server error' }, 500),
          )
        }

        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeFavoritesResponse([ITEM_ID]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      await user.click(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      )

      await waitFor(() => {
        expect(screen.getByText(String(INITIAL_COUNT))).toBeInTheDocument()
      })
    })
  })

  describe('Cache', () => {
    test('it does not re-fetch favorites when re-rendered without interaction', async () => {
      const client = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      const { rerender } = render(
        <QueryClientProvider client={client}>
          <FavoriteCount itemId={ITEM_ID} initialCount={INITIAL_COUNT} />
        </QueryClientProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText(String(INITIAL_COUNT))).toBeInTheDocument()
      })

      fetchMock.mockClear()

      rerender(
        <QueryClientProvider client={client}>
          <FavoriteCount itemId={ITEM_ID} initialCount={INITIAL_COUNT} />
        </QueryClientProvider>,
      )

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
