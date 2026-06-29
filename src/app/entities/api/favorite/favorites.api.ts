import { http } from '@/pkg/rest-api/fetcher'

import type {
  IGetFavoriteItemsParams,
  IGetFavoriteItemsResponse,
  IGetFavoritesIdsResponse,
} from '../../models/favorite.model'

export const fetchFavoriteItems = async (params: IGetFavoriteItemsParams) => {
  return http.get<IGetFavoriteItemsResponse>('/api/favorites/items', params)
}

export const fetchFavoritesIds = async () => {
  return http.get<IGetFavoritesIdsResponse>('/api/favorites')
}

export const addFavorite = async (itemId: string) => {
  return http.post<void>('/api/favorites', { itemId })
}

export const removeFavorite = async (itemId: string) => {
  return http.delete<void>('/api/favorites', { itemId })
}
