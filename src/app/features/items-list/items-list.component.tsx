'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FC } from 'react'

import { itemsQueryOptions } from '@/app/entities/api/item'
import { FavoriteCountComponent } from '@/app/shared/components/favorite-count'
import { ItemCardComponent } from '@/app/shared/components/item-card/item-card.component'
import { ListFallBackComponent } from '@/app/shared/components/list-fallback'
import { ToggleFavoriteButtonComponent } from '@/app/shared/components/toggle-favorite'
import { Pagination } from '@/pkg/theme/ui/pagination'

export const ItemsListComponent: FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const term = searchParams.get('term') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))

  const { data, isPending } = useQuery(itemsQueryOptions({ term, sort, page }))

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('page', String(next))
    router.push(`/items?${params.toString()}`)
  }

  if (isPending) {
    return <ListFallBackComponent />
  }

  if (!data || data.items.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center">No pizzas found</p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
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
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
