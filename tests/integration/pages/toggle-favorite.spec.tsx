import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSearchParams } from 'next/navigation'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { ToggleFavoriteButton } from '@/app/features/toggle-favorite'

const fetchMock = vi.hoisted(() => {
  const mock = vi.fn()

  vi.stubGlobal('fetch', mock)

  return mock
})

vi.mock('next/navigation')

const mockUseSession = vi.hoisted(() => vi.fn())

vi.mock('@/pkg/auth/auth-client', () => ({
  useSession: mockUseSession,
}))

const mockSession = { user: { id: 'user-1', email: 'test@example.com' } }
const item_id = 'pizza-1'

const makeJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const makeFavoritesResponse = (itemIds: string[]) =>
  makeJsonResponse({ itemIds })

const renderButton = (itemId = item_id) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )

  return {
    ...render(<ToggleFavoriteButton itemId={itemId} />, { wrapper: Wrapper }),
    client,
  }
}

beforeEach(() => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams() as ReturnType<typeof useSearchParams>,
  )
  mockUseSession.mockReturnValue({ data: mockSession })
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/favorites')) {
      return Promise.resolve(makeFavoritesResponse([]))
    }

    return Promise.resolve(makeJsonResponse({}))
  })
})

describe('Integration | Component | ToggleFavoriteButton', () => {
  test('it does not render for unauthenticated users', () => {
    mockUseSession.mockReturnValue({ data: null })

    renderButton()

    expect(
      screen.queryByRole('button', { name: 'Add to favorites' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Remove from favorites' }),
    ).not.toBeInTheDocument()
  })

  test('it renders "Add to favorites" when the item is not favorited', async () => {
    renderButton()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add to favorites' }),
      ).toBeInTheDocument()
    })
  })

  test('it renders "Remove from favorites" when the item is already favorited', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/favorites')) {
        return Promise.resolve(makeFavoritesResponse([item_id]))
      }

      return Promise.resolve(makeJsonResponse({}))
    })

    renderButton()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      ).toBeInTheDocument()
    })
  })

  describe('Adding to favorites', () => {
    test('it calls POST /api/favorites with the item id on click', async () => {
      const user = userEvent.setup()

      renderButton()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockClear()
      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'POST') {
          return Promise.resolve(makeJsonResponse({ ok: true }))
        }

        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeFavoritesResponse([item_id]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

      await waitFor(() => {
        const call = fetchMock.mock.calls.find((args) => {
          const [url, init] = args as [string, RequestInit]

          return url.includes('/api/favorites') && init?.method === 'POST'
        })

        expect(call).toBeDefined()
        expect(JSON.parse(call![1].body as string)).toMatchObject({
          itemId: item_id,
        })
      })
    })

    test('it optimistically shows "Remove from favorites" before the server responds', async () => {
      const user = userEvent.setup()
      let resolveMutation!: (r: Response) => void

      renderButton()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'POST') {
          return new Promise<Response>((resolve) => {
            resolveMutation = resolve
          })
        }

        return Promise.resolve(makeFavoritesResponse([]))
      })

      await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

      expect(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      ).toBeInTheDocument()

      resolveMutation(makeJsonResponse({ ok: true }))
    })
  })

  describe('Removing from favorites', () => {
    test('it calls DELETE /api/favorites?itemId=... on click', async () => {
      const user = userEvent.setup()

      fetchMock.mockImplementation((url: string) => {
        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeFavoritesResponse([item_id]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      renderButton()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove from favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockClear()
      fetchMock.mockResolvedValue(makeJsonResponse({ ok: true }))

      await user.click(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      )

      await waitFor(() => {
        const call = fetchMock.mock.calls.find((args) => {
          const [url, init] = args as [string, RequestInit]

          return url.includes('/api/favorites') && init?.method === 'DELETE'
        })

        expect(call).toBeDefined()
        expect(call![0]).toContain(`itemId=${item_id}`)
      })
    })

    test('it optimistically shows "Add to favorites" before the server responds', async () => {
      const user = userEvent.setup()
      let resolveMutation!: (r: Response) => void

      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'DELETE') {
          return new Promise<Response>((resolve) => {
            resolveMutation = resolve
          })
        }

        return Promise.resolve(makeFavoritesResponse([item_id]))
      })

      renderButton()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove from favorites' }),
        ).toBeInTheDocument()
      })

      await user.click(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      )

      expect(
        screen.getByRole('button', { name: 'Add to favorites' }),
      ).toBeInTheDocument()

      resolveMutation(makeJsonResponse({ ok: true }))
    })
  })

  describe('Rollback on error', () => {
    test('it reverts to "Add to favorites" when POST fails', async () => {
      const user = userEvent.setup()

      renderButton()

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

        return Promise.resolve(makeFavoritesResponse([]))
      })

      await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })
    })

    test('it reverts to "Remove from favorites" when DELETE fails', async () => {
      const user = userEvent.setup()

      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'DELETE') {
          return Promise.resolve(
            makeJsonResponse({ error: 'Server error' }, 500),
          )
        }

        return Promise.resolve(makeFavoritesResponse([item_id]))
      })

      renderButton()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove from favorites' }),
        ).toBeInTheDocument()
      })

      await user.click(
        screen.getByRole('button', { name: 'Remove from favorites' }),
      )

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove from favorites' }),
        ).toBeInTheDocument()
      })
    })
  })

  describe('Cache invalidation', () => {
    test('it re-fetches favorites after a successful toggle', async () => {
      const user = userEvent.setup()

      renderButton()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockClear()
      fetchMock.mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes('/api/favorites') && init?.method === 'POST') {
          return Promise.resolve(makeJsonResponse({ ok: true }))
        }

        if (url.includes('/api/favorites')) {
          return Promise.resolve(makeFavoritesResponse([item_id]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

      await waitFor(() => {
        const favoritesCalls = fetchMock.mock.calls.filter((args) =>
          (args[0] as string).includes('/api/favorites'),
        )

        expect(favoritesCalls.length).toBeGreaterThan(0)
      })
    })

    test('it marks the items query as stale after a successful toggle', async () => {
      const user = userEvent.setup()

      const { client } = renderButton()

      const itemsQueryKey = ['items', { term: '', sort: 'newest', page: 1 }]

      client.setQueryData(itemsQueryKey, {
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
      })

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
          return Promise.resolve(makeFavoritesResponse([item_id]))
        }

        return Promise.resolve(makeJsonResponse({}))
      })

      await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

      await waitFor(() => {
        const cachedQuery = client
          .getQueryCache()
          .find({ queryKey: itemsQueryKey })

        expect(cachedQuery?.state.isInvalidated).toBe(true)
      })
    })

    test('it does not re-fetch favorites when re-rendered without interaction', async () => {
      const { rerender } = renderButton()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Add to favorites' }),
        ).toBeInTheDocument()
      })

      fetchMock.mockClear()

      rerender(<ToggleFavoriteButton itemId={item_id} />)

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
