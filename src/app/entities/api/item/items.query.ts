import { queryOptions } from '@tanstack/react-query'

import type { IGetItemsParams } from '../../models/item.model'
import { fetchItem, fetchItems } from './items.api'

export const itemsQueryOptions = (params: IGetItemsParams) =>
  queryOptions({
    queryKey: ['items', params],
    queryFn: () => fetchItems(params),
  })

export const itemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['items', id],
    queryFn: () => fetchItem(id),
  })
