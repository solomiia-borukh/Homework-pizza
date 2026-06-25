import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { favorites } from '@/app/entities/schemas'
import { db } from '@/config/db'
import { authServer } from '@/pkg/auth/server'

export const GET = async () => {
  const session = await authServer.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db
    .select({ itemId: favorites.itemId })
    .from(favorites)
    .where(eq(favorites.userId, session.user.id))

  return NextResponse.json({ itemIds: rows.map((r) => r.itemId) })
}

export const POST = async (request: NextRequest) => {
  const session = await authServer.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { itemId } = await request.json()

  if (!itemId || typeof itemId !== 'string') {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 })
  }

  await db
    .insert(favorites)
    .values({ userId: session.user.id, itemId })
    .onConflictDoNothing()

  return NextResponse.json({ ok: true })
}

export const DELETE = async (request: NextRequest) => {
  const session = await authServer.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const itemId = searchParams.get('itemId')

  if (!itemId) {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 })
  }

  await db
    .delete(favorites)
    .where(
      and(eq(favorites.userId, session.user.id), eq(favorites.itemId, itemId)),
    )

  return NextResponse.json({ ok: true })
}
