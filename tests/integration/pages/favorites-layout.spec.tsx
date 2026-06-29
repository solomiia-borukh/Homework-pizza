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

const renderSearch = async () => {
  const user = userEvent.setup()

  render(<ItemSearchComponent basePath="/favorites" />)

  await waitFor(() => expect(mockPush).toHaveBeenCalled())
  mockPush.mockClear()

  return user
}

describe('Integration | Component | ItemSearch (favorites)', () => {
  test('it pushes to /favorites when typing', async () => {
    const user = await renderSearch()

    await user.type(
      screen.getByPlaceholderText('Search pizzas...'),
      'Margherita',
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/favorites?term=Margherita'),
      )
    })
  })

  test('it does not push to /items when typing', async () => {
    const user = await renderSearch()

    await user.type(screen.getByPlaceholderText('Search pizzas...'), 'pizza')

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled()
    })

    const pushedUrl = mockPush.mock.calls.at(-1)?.[0] as string

    expect(pushedUrl).not.toContain('/items')
  })

  test('it resets page to 1 on search', async () => {
    const user = await renderSearch()

    await user.type(screen.getByPlaceholderText('Search pizzas...'), 'pizza')

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=1'))
    })
  })

  test('it pushes to /favorites with sort param when sort changes', async () => {
    const user = await renderSearch()

    await user.click(screen.getByRole('button', { name: 'Sort options' }))

    await waitFor(() => {
      expect(screen.getByText('A → Z')).toBeInTheDocument()
    })

    await user.click(screen.getByText('A → Z'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/favorites?'),
      )
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=az'))
    })
  })
})
