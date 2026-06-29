import { count, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { favorites, items } from '@/app/entities/schemas'
import { db } from '@/config/db'

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
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

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(item)
}
