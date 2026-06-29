import { Pizza } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { FC, ReactNode } from 'react'

import type { Item } from '@/app/entities/schemas'
import { cn } from '@/pkg/theme/lib/utils'

interface IProps {
  item: Omit<Item, 'createdAt'> & { favoritesCount: number }
  favoriteSlot?: ReactNode
  favoriteCountSlot?: ReactNode
  priority?: boolean
}

export const ItemCardComponent: FC<Readonly<IProps>> = (props) => {
  const { item, favoriteSlot, favoriteCountSlot, priority = false } = props
  const { id, title, description, imageUrl } = item

  return (
    <Link
      href={`/items/${id}`}
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border bg-card p-4',
        'transition-shadow hover:shadow-md cursor-pointer',
      )}
    >
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <Pizza className="size-16 text-muted-foreground" />
        )}
        {favoriteSlot}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold leading-tight">{title}</h3>
          {favoriteCountSlot}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description ?? '—'}
        </p>
      </div>
    </Link>
  )
}
