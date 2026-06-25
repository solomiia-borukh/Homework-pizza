import { asc, count, desc, eq, ilike } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { favorites, items } from '@/app/entities/schemas'
import { db } from '@/config/db'

const LIMIT = 6

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const term = searchParams.get('term') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const sort = searchParams.get('sort') ?? 'newest'

  const where = term ? ilike(items.title, `%${term}%`) : undefined

  const orderBy =
    sort === 'az'
      ? asc(items.title)
      : sort === 'za'
        ? desc(items.title)
        : desc(items.createdAt)

  const [{ total }] = await db
    .select({ total: count() })
    .from(items)
    .where(where)

  const data = await db
    .select({
      id: items.id,
      title: items.title,
      description: items.description,
      imageUrl: items.imageUrl,
      createdAt: items.createdAt,
      favoritesCount: count(favorites.id),
    })
    .from(items)
    .leftJoin(favorites, eq(favorites.itemId, items.id))
    .where(where)
    .groupBy(items.id)
    .orderBy(orderBy)
    .limit(LIMIT)
    .offset((page - 1) * LIMIT)

  return NextResponse.json({
    items: data,
    total,
    page,
    totalPages: Math.ceil(total / LIMIT),
  })
}
