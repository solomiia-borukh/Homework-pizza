import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { BackButton } from '@/pkg/theme/ui/back-button'

vi.mock('next/navigation')

const mockBack = vi.fn()

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({
    back: mockBack,
  } as unknown as ReturnType<typeof useRouter>)
  vi.resetAllMocks()
})

describe('Unit | Component | BackButton', () => {
  test('it renders the default "Back" label', () => {
    render(<BackButton />)

    expect(screen.getByRole('button', { name: '← Back' })).toBeInTheDocument()
  })

  test('it renders a custom label', () => {
    render(<BackButton label="All pizzas" />)

    expect(
      screen.getByRole('button', { name: '← All pizzas' }),
    ).toBeInTheDocument()
  })

  test('it calls router.back() when clicked', async () => {
    const user = userEvent.setup()

    vi.mocked(useRouter).mockReturnValue({
      back: mockBack,
    } as unknown as ReturnType<typeof useRouter>)

    render(<BackButton />)

    await user.click(screen.getByRole('button', { name: '← Back' }))

    expect(mockBack).toHaveBeenCalledOnce()
  })
})
