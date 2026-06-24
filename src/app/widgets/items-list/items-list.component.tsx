'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FC } from 'react'

import { ItemCard, itemsQueryOptions } from '@/app/entities/item'
import {
  FavoriteCount,
  ToggleFavoriteButton,
} from '@/app/features/toggle-favorite'
import { Pagination } from '@/app/shared/ui/pagination'

export const ItemsList: FC = () => {
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
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-6">No pizzas found</p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
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
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
