import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  addFavorite,
  type FavoritesResponse,
  removeFavorite,
} from './favorites.api'

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      isFavorite,
    }: {
      itemId: string
      isFavorite: boolean
    }) => (isFavorite ? removeFavorite(itemId) : addFavorite(itemId)),

    onMutate: async ({ itemId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] })

      const previous = queryClient.getQueryData<FavoritesResponse>([
        'favorites',
      ])

      queryClient.setQueryData<FavoritesResponse>(['favorites'], (old) => ({
        itemIds: isFavorite
          ? (old?.itemIds ?? []).filter((id) => id !== itemId)
          : [...(old?.itemIds ?? []), itemId],
      }))

      return { previous }
    },

    onError: (_err, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['favorites'], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
