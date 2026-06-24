'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import type { FC } from 'react'

import { favoriteItemsQueryOptions } from '@/app/entities/favorite'
import { ItemCard } from '@/app/entities/item'
import {
  FavoriteCount,
  ToggleFavoriteButton,
} from '@/app/features/toggle-favorite'
import { ListFallBack } from '@/app/shared/ui/list-fallback'

export const FavoritesList: FC = () => {
  const searchParams = useSearchParams()

  const term = searchParams.get('term') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'

  const { data, isPending } = useQuery(
    favoriteItemsQueryOptions({ term, sort }),
  )

  if (isPending) {
    return <ListFallBack />
  }

  if (!data || data.items.length === 0) {
    return (
      <p className="py-6 text-center text-muted-foreground">No favorites yet</p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((item, index) => (
        <ItemCard
          key={item.id}
          item={item}
          favoriteSlot={<ToggleFavoriteButton itemId={item.id} />}
          favoriteCountSlot={
            <FavoriteCount
              itemId={item.id}
              initialCount={item.favoritesCount}
            />
          }
          priority={index === 0}
        />
      ))}
    </div>
  )
}
