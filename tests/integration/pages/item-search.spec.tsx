import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { ItemSearchComponent } from '@/app/shared/components/item-search'

vi.mock('next/navigation')

const mockPush = vi.fn()

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
  } as unknown as ReturnType<typeof useRouter>)
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams() as ReturnType<typeof useSearchParams>,
  )
})

afterEach(() => {
  vi.resetAllMocks()
})

const renderSearch = () => {
  const user = userEvent.setup()

  render(<ItemSearchComponent />)

  return user
}

describe('Integration | Component | ItemSearch', () => {
  test('it renders a search input', async () => {
    await renderSearch()

    expect(screen.getByPlaceholderText('Search pizzas...')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Sort options' }),
    ).toBeInTheDocument()
  })

  describe('Typing debounce', () => {
    test('it does not push URL immediately after typing (before 300ms)', async () => {
      const user = await renderSearch()

      await user.type(screen.getByPlaceholderText('Search pizzas...'), 'Mar')

      expect(mockPush).not.toHaveBeenCalled()
    })

    test('it pushes the URL with the term after the debounce fires', async () => {
      const user = await renderSearch()

      await user.type(
        screen.getByPlaceholderText('Search pizzas...'),
        'Margherita',
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('term=Margherita'),
        )
      })
    })

    test('it always resets page to 1 when searching', async () => {
      const user = await renderSearch()

      await user.type(screen.getByPlaceholderText('Search pizzas...'), 'pizza')

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=1'))
      })
    })

    test('it preserves an existing sort param when searching', async () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams('sort=az') as ReturnType<typeof useSearchParams>,
      )
      const user = userEvent.setup()

      render(<ItemSearchComponent />)

      await user.type(screen.getByPlaceholderText('Search pizzas...'), 'pizza')

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('sort=az'),
        )
      })
    })
  })

  describe('Clearing search', () => {
    test('it does not include term in the URL when input is emptied', async () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams('term=old') as ReturnType<typeof useSearchParams>,
      )
      const user = userEvent.setup()

      render(<ItemSearchComponent />)

      await user.clear(screen.getByPlaceholderText('Search pizzas...'))

      await waitFor(() => {
        const pushedUrl = mockPush.mock.calls.at(-1)?.[0] as string
        const params = new URLSearchParams(pushedUrl.split('?')[1] ?? '')

        expect(params.has('term')).toBe(false)
      })
    })
  })
})
