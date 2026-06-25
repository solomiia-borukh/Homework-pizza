import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

import { user } from './auth.schema'

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert

export const favorites = pgTable(
  'favorites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique().on(table.userId, table.itemId)],
)

export type Favorite = typeof favorites.$inferSelect
export type NewFavorite = typeof favorites.$inferInsert
