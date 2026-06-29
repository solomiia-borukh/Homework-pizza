import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { IGetFavoritesIdsResponse } from '../../models/favorite.model'
import { addFavorite, removeFavorite } from './favorites.api'

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

      const previous = queryClient.getQueryData<IGetFavoritesIdsResponse>([
        'favorites',
      ])

      queryClient.setQueryData<IGetFavoritesIdsResponse>(
        ['favorites'],
        (old) => ({
          itemIds: isFavorite
            ? (old?.itemIds ?? []).filter((id) => id !== itemId)
            : [...(old?.itemIds ?? []), itemId],
        }),
      )

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
