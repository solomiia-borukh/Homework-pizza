import { http } from '@/pkg/rest-api/fetcher'

export type IItemsParams = {
  term?: string
  page?: number
  sort?: string
}

export type IItemsResponse = {
  items: {
    id: string
    title: string
    description: string | null
    imageUrl: string | null
    createdAt: string
    favoritesCount: number
  }[]
  total: number
  page: number
  totalPages: number
}

export const fetchItems = async (params: IItemsParams) => {
  return http.get<IItemsResponse>('/api/items', params)
}
