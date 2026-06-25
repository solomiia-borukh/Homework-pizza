import { and, asc, count, desc, eq, ilike } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { type NextRequest, NextResponse } from 'next/server'

import { favorites, items } from '@/app/entities/schemas'
import { db } from '@/config/db'
import { authServer } from '@/pkg/auth/server'

export const GET = async (request: NextRequest) => {
  const session = await authServer.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const term = searchParams.get('term') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'

  const allFavorites = alias(favorites, 'all_favorites')

  const orderBy =
    sort === 'az'
      ? asc(items.title)
      : sort === 'za'
        ? desc(items.title)
        : desc(items.createdAt)

  const data = await db
    .select({
      id: items.id,
      title: items.title,
      description: items.description,
      imageUrl: items.imageUrl,
      createdAt: items.createdAt,
      favoritesCount: count(allFavorites.id),
    })
    .from(favorites)
    .innerJoin(items, eq(favorites.itemId, items.id))
    .leftJoin(allFavorites, eq(allFavorites.itemId, items.id))
    .where(
      term
        ? and(
            eq(favorites.userId, session.user.id),
            ilike(items.title, `%${term}%`),
          )
        : eq(favorites.userId, session.user.id),
    )
    .groupBy(items.id, favorites.id)
    .orderBy(orderBy)

  return NextResponse.json({ items: data })
}
