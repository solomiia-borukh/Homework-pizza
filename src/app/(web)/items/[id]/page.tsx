import { BackButtonComponent } from '@shared/components/back-button'
import { count, eq } from 'drizzle-orm'
import { Pizza } from 'lucide-react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { favorites, items } from '@/app/entities/schemas'
import {
  FavoriteCountComponent,
  ToggleFavoriteButtonComponent,
} from '@/app/features/toggle-favorite'
import { db } from '@/config/db'

interface IProps {
  params: Promise<{ id: string }>
}

const Page: NextPage<IProps> = async (props) => {
  const { params } = props
  const { id } = await params

  const [item] = await db
    .select({
      id: items.id,
      title: items.title,
      description: items.description,
      imageUrl: items.imageUrl,
      favoritesCount: count(favorites.id),
    })
    .from(items)
    .leftJoin(favorites, eq(favorites.itemId, items.id))
    .where(eq(items.id, id))
    .groupBy(items.id)

  if (!item) notFound()

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 md:px-8">
      <BackButtonComponent />
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
          <Suspense>
            <ToggleFavoriteButtonComponent itemId={item.id} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold leading-tight">
              {item.title}
            </h1>
            <Suspense>
              <FavoriteCountComponent
                itemId={item.id}
                initialCount={item.favoritesCount}
              />
            </Suspense>
          </div>
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default Page
