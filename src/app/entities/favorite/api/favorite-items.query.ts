import { queryOptions } from '@tanstack/react-query'

import {
  type FavoriteItemsParams,
  fetchFavoriteItems,
} from './favorite-items.api'

export const favoriteItemsQueryOptions = (params: FavoriteItemsParams = {}) =>
  queryOptions({
    queryKey: ['favorites', 'items', params],
    queryFn: () => fetchFavoriteItems(params),
  })
