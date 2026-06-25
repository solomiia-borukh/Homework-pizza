import { queryOptions } from '@tanstack/react-query'

import {
  fetchFavoriteItems,
  type IFavoriteItemsParams,
} from './favorite-items.api'

export const favoriteItemsQueryOptions = (params: IFavoriteItemsParams = {}) =>
  queryOptions({
    queryKey: ['favorites', 'items', params],
    queryFn: () => fetchFavoriteItems(params),
  })
