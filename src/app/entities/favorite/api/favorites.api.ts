export type FavoritesResponse = {
  itemIds: string[]
}

export const fetchFavorites = async (): Promise<FavoritesResponse> => {
  const response = await fetch('/api/favorites')

  if (!response.ok) {
    throw new Error('Failed to fetch favorites')
  }

  return response.json()
}

export const addFavorite = async (itemId: string): Promise<void> => {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId }),
  })

  if (!response.ok) {
    throw new Error('Failed to add favorite')
  }
}

export const removeFavorite = async (itemId: string): Promise<void> => {
  const response = await fetch(`/api/favorites?itemId=${itemId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to remove favorite')
  }
}
