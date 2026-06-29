export type IGetItemsParams = {
  term?: string
  page?: number
  sort?: string
}

export type IGetItemsResponse = {
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
