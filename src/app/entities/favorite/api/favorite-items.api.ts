import type { IItemsResponse } from '@/app/entities/item'
import { http } from '@/pkg/rest-api/fetcher'

export type IFavoriteItemsParams = {
  term?: string
  sort?: string
}

export type IFavoriteItemsResponse = Pick<IItemsResponse, 'items'>

export const fetchFavoriteItems = async (params: IFavoriteItemsParams = {}) => {
  return http.get<IFavoriteItemsResponse>('/api/favorites/items', params)
}
