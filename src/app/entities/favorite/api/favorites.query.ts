import { queryOptions } from '@tanstack/react-query'

import { fetchFavorites } from './favorites.api'

export const favoritesQueryOptions = () =>
  queryOptions({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
  })
