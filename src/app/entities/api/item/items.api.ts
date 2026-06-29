import { http } from '@/pkg/rest-api/fetcher'

import type {
  IGetItemResponse,
  IGetItemsParams,
  IGetItemsResponse,
} from '../../models/item.model'

export const fetchItems = async (params: IGetItemsParams) => {
  return http.get<IGetItemsResponse>('/api/items', params)
}

export const fetchItem = async (id: string) => {
  return http.get<IGetItemResponse>(`/api/items/${id}`)
}
