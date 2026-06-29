import type { IGetItemsResponse } from './item.model'

export type IGetFavoritesIdsResponse = {
  itemIds: string[]
}

export type IGetFavoriteItemsParams = {
  term?: string
  sort?: string
}

export type IGetFavoriteItemsResponse = Pick<IGetItemsResponse, 'items'>
