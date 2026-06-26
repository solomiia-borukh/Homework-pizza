import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { ItemCardComponent } from '@/app/entities/item'

const item = {
  id: 'pizza-1',
  title: 'Margherita',
  description: 'Classic tomato sauce, fresh mozzarella, and basil.',
  imageUrl: 'https://example.com/margherita.jpg',
  favoritesCount: 5,
}

describe('Unit | Component | ItemCard', () => {
  test('it renders the title, description, favoriteCountSlot and image', () => {
    render(
      <ItemCardComponent
        item={item}
        favoriteCountSlot={<span aria-label="favorites count">5</span>}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Margherita' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Classic tomato sauce, fresh mozzarella, and basil.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Margherita' })).toBeInTheDocument()

    expect(
      screen.getByRole('generic', { name: 'favorites count' }),
    ).toBeInTheDocument()
  })

  test('it renders the favoriteSlot in the image area', () => {
    render(
      <ItemCardComponent
        item={item}
        favoriteSlot={<button aria-label="toggle favorite">♥</button>}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'toggle favorite' }),
    ).toBeInTheDocument()
  })

  test('it links to the correct item detail page', () => {
    render(<ItemCardComponent item={item} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/items/pizza-1')
  })

  test('it does not render a pizza image when imageUrl is null', () => {
    render(<ItemCardComponent item={{ ...item, imageUrl: null }} />)

    expect(
      screen.queryByRole('img', { name: 'Margherita' }),
    ).not.toBeInTheDocument()
  })
})
