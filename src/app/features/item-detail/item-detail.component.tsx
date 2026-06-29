'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Pizza } from 'lucide-react'
import Image from 'next/image'
import { type FC } from 'react'

import { itemQueryOptions } from '@/app/entities/api/item'
import { FavoriteCountComponent } from '@/app/shared/components/favorite-count'
import { ToggleFavoriteButtonComponent } from '@/app/shared/components/toggle-favorite'
import { BackButton } from '@/pkg/theme/ui/back-button'

interface IProps {
  id: string
}

export const ItemDetailComponent: FC<IProps> = (props) => {
  const { id } = props
  const { data: item } = useSuspenseQuery(itemQueryOptions(id))

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 md:px-8">
      <BackButton className="mb-3" />

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-muted sm:h-80">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(min-width: 672px) 640px, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <Pizza className="size-20 text-muted-foreground" />
          )}
          <ToggleFavoriteButtonComponent itemId={item.id} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold leading-tight">
              {item.title}
            </h1>
            <FavoriteCountComponent
              itemId={item.id}
              initialCount={item.favoritesCount}
            />
          </div>
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}
        </div>
      </div>
    </main>
  )
}
