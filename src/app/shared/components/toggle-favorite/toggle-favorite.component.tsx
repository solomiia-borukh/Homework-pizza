'use client'

import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import type { FC, MouseEvent } from 'react'

import {
  favoritesIdsQueryOptions,
  useToggleFavoriteMutation,
} from '@/app/entities/api/favorite'
import { useSession } from '@/pkg/auth/client/auth.client'
import { cn } from '@/pkg/theme/lib/utils'

interface IProps {
  itemId: string
}

export const ToggleFavoriteButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { itemId } = props

  const { data: session } = useSession()
  const { data: favorites } = useQuery({
    ...favoritesIdsQueryOptions(),
    enabled: !!session,
  })
  const { mutate, isPending } = useToggleFavoriteMutation()

  if (!session) return null

  const isFavorite = favorites?.itemIds.includes(itemId) ?? false

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isPending) mutate({ itemId, isFavorite })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={cn(
        'absolute top-2 right-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full',
        'bg-white/80 backdrop-blur-sm transition-colors hover:bg-white',
        isPending && 'opacity-60',
      )}
    >
      <Heart
        className={cn(
          'size-4 transition-colors',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500',
        )}
      />
    </button>
  )
}
