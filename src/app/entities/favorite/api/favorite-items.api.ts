import type { IItemsResponse } from '@/app/entities/item'

export type IFavoriteItemsParams = {
  term?: string
  sort?: string
}

export type IFavoriteItemsResponse = Pick<IItemsResponse, 'items'>

export const fetchFavoriteItems = async (
  params: IFavoriteItemsParams = {},
): Promise<IFavoriteItemsResponse> => {
  const query = new URLSearchParams()

  if (params.term) query.set('term', params.term)
  if (params.sort) query.set('sort', params.sort)

  const response = await fetch(`/api/favorites/items?${query.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch favorite items')
  }

  return response.json()
}
