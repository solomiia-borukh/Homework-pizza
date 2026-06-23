export type ItemsParams = {
  term?: string
  page?: number
  sort?: string
}

export type ItemsResponse = {
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

export const fetchItems = async (
  params: ItemsParams,
): Promise<ItemsResponse> => {
  const query = new URLSearchParams()

  if (params.term) query.set('term', params.term)
  if (params.page) query.set('page', String(params.page))
  if (params.sort) query.set('sort', params.sort)

  const response = await fetch(`/api/items?${query.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch items')
  }

  return response.json()
}
