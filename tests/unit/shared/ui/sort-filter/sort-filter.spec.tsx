import { SortFilterComponent } from '@shared/ui/sort-filter'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

const OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

describe('Unit | Component | SortFilter', () => {
  test('it renders the sort button', () => {
    render(
      <SortFilterComponent
        options={OPTIONS}
        value="newest"
        onChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Sort options' }),
    ).toBeInTheDocument()
  })

  test('it shows all options when the button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <SortFilterComponent
        options={OPTIONS}
        value="newest"
        onChange={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Sort options' }))

    await waitFor(() => {
      expect(screen.getByText('Newest')).toBeInTheDocument()
      expect(screen.getByText('A → Z')).toBeInTheDocument()
      expect(screen.getByText('Z → A')).toBeInTheDocument()
    })
  })

  test('it calls onChange with the selected value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <SortFilterComponent
        options={OPTIONS}
        value="newest"
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Sort options' }))

    await waitFor(() => {
      expect(screen.getByText('A → Z')).toBeInTheDocument()
    })

    await user.click(screen.getByText('A → Z'))

    expect(onChange).toHaveBeenCalledWith('az')
  })

  test('it closes the menu after an option is selected', async () => {
    const user = userEvent.setup()

    render(
      <SortFilterComponent
        options={OPTIONS}
        value="newest"
        onChange={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Sort options' }))

    await waitFor(() => {
      expect(screen.getByText('A → Z')).toBeInTheDocument()
    })

    await user.click(screen.getByText('A → Z'))

    await waitFor(() => {
      expect(screen.queryByText('A → Z')).not.toBeInTheDocument()
    })
  })

  test('it marks the currently selected option with aria-checked', async () => {
    const user = userEvent.setup()

    render(
      <SortFilterComponent options={OPTIONS} value="az" onChange={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'Sort options' }))

    await waitFor(() => {
      expect(screen.getByText('A → Z')).toBeInTheDocument()
    })

    const azOption = screen.getByRole('menuitemradio', { name: 'A → Z' })

    expect(azOption).toHaveAttribute('aria-checked', 'true')
    expect(
      screen.getByRole('menuitemradio', { name: 'Newest' }),
    ).toHaveAttribute('aria-checked', 'false')
  })
})
