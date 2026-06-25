import { queryOptions } from '@tanstack/react-query'

import { fetchItems, type IItemsParams } from './items.api'

export const itemsQueryOptions = (params: IItemsParams) =>
  queryOptions({
    queryKey: ['items', params],
    queryFn: () => fetchItems(params),
  })
