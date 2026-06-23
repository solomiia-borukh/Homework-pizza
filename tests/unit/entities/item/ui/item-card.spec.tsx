import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { ItemCard } from '@/app/entities/item'

const item = {
  id: 'pizza-1',
  title: 'Margherita',
  description: 'Classic tomato sauce, fresh mozzarella, and basil.',
  imageUrl: 'https://example.com/margherita.jpg',
  favoritesCount: 5,
}

describe('Unit | Component | ItemCard', () => {
  test('it renders the title, description, count and image', () => {
    render(<ItemCard item={item} />)

    expect(
      screen.getByRole('heading', { name: 'Margherita' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Classic tomato sauce, fresh mozzarella, and basil.'),
    ).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Margherita' })).toBeInTheDocument()
  })

  test('it renders the favoriteSlot', () => {
    render(
      <ItemCard
        item={item}
        favoriteSlot={<button aria-label="toggle favorite">♥</button>}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'toggle favorite' }),
    ).toBeInTheDocument()
  })

  test('it links to the correct item detail page', () => {
    render(<ItemCard item={item} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/items/pizza-1')
  })

  test('it renders zero favorites count', () => {
    render(<ItemCard item={{ ...item, favoritesCount: 0 }} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('it does not render a pizza image when imageUrl is null', () => {
    render(<ItemCard item={{ ...item, imageUrl: null }} />)

    expect(
      screen.queryByRole('img', { name: 'Margherita' }),
    ).not.toBeInTheDocument()
  })
})
