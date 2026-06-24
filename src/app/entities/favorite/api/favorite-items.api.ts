import type { ItemsResponse } from '@/app/entities/item'

export type FavoriteItemsParams = {
  term?: string
  sort?: string
}

export type FavoriteItemsResponse = Pick<ItemsResponse, 'items'>

export const fetchFavoriteItems = async (
  params: FavoriteItemsParams = {},
): Promise<FavoriteItemsResponse> => {
  const query = new URLSearchParams()

  if (params.term) query.set('term', params.term)
  if (params.sort) query.set('sort', params.sort)

  const response = await fetch(`/api/favorites/items?${query.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch favorite items')
  }

  return response.json()
}
