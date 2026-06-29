import { queryOptions } from '@tanstack/react-query'

import type { IGetFavoriteItemsParams } from '../../models/favorite.model'
import { fetchFavoriteItems, fetchFavoritesIds } from './favorites.api'

export const favoritesIdsQueryOptions = () =>
  queryOptions({
    queryKey: ['favorites'],
    queryFn: fetchFavoritesIds,
  })

export const favoriteItemsQueryOptions = (
  params: IGetFavoriteItemsParams = {},
) =>
  queryOptions({
    queryKey: ['favorites', 'items', params],
    queryFn: () => fetchFavoriteItems(params),
  })
