import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { type SearchParams } from 'next/dist/server/request/search-params'
import type { FC } from 'react'
import { Suspense } from 'react'

import { itemsQueryOptions } from '@/app/entities/item'
import { ItemsList } from '@/app/widgets/items-list'

interface Props {
  searchParams: Promise<SearchParams>
}

const ItemsPage: FC<Props> = async ({ searchParams }) => {
  const params = await searchParams
  const term = String(params.term ?? '')
  const sort = String(params.sort ?? 'newest')
  const page = Math.max(1, Number(params.page ?? '1'))

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(itemsQueryOptions({ term, sort, page }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ItemsList />
      </Suspense>
    </HydrationBoundary>
  )
}

export default ItemsPage
