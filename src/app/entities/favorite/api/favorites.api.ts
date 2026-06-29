import { http } from '@/pkg/rest-api/fetcher'

export type IFavoritesResponse = {
  itemIds: string[]
}

export const fetchFavorites = async () => {
  return http.get<IFavoritesResponse>('/api/favorites')
}

export const addFavorite = async (itemId: string) => {
  return http.post<void>('/api/favorites', { itemId })
}

export const removeFavorite = async (itemId: string) => {
  return http.delete<void>('/api/favorites', { itemId })
}
