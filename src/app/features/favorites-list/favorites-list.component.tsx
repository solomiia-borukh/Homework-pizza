'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import type { FC } from 'react'

import { favoriteItemsQueryOptions } from '@/app/entities/api/favorite'
import { FavoriteCountComponent } from '@/app/shared/components/favorite-count'
import { ItemCardComponent } from '@/app/shared/components/item-card/item-card.component'
import { ListFallBackComponent } from '@/app/shared/components/list-fallback'
import { ToggleFavoriteButtonComponent } from '@/app/shared/components/toggle-favorite'

export const FavoritesListComponent: FC = () => {
  const searchParams = useSearchParams()

  const term = searchParams.get('term') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'

  const { data, isPending } = useQuery(
    favoriteItemsQueryOptions({ term, sort }),
  )

  if (isPending) {
    return <ListFallBackComponent />
  }

  if (!data || data.items.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center">No favorites yet</p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((item, index) => (
        <ItemCardComponent
          key={item.id}
          item={item}
          favoriteSlot={<ToggleFavoriteButtonComponent itemId={item.id} />}
          favoriteCountSlot={
            <FavoriteCountComponent
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
