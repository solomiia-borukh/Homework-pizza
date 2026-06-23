import { queryOptions } from '@tanstack/react-query'

import { fetchItems, type ItemsParams } from './items.api'

export const itemsQueryOptions = (params: ItemsParams) =>
  queryOptions({
    queryKey: ['items', params],
    queryFn: () => fetchItems(params),
  })
