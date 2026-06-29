import { http } from '@/pkg/rest-api/fetcher'

import type {
  IGetItemsParams,
  IGetItemsResponse,
} from '../../models/item.model'

export const fetchItems = async (params: IGetItemsParams) => {
  return http.get<IGetItemsResponse>('/api/items', params)
}
