import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import type { NextPage } from 'next'
import { type SearchParams } from 'next/dist/server/request/search-params'

import { itemsQueryOptions } from '@/app/entities/api/item/items.query'
import { ItemsListComponent } from '@/app/features/items-list'

interface IProps {
  searchParams: Promise<SearchParams>
}

const Page: NextPage<IProps> = async (props) => {
  const { searchParams } = props

  const params = await searchParams
  const term = String(params.term ?? '')
  const sort = String(params.sort ?? 'newest')
  const page = Math.max(1, Number(params.page ?? '1'))

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(itemsQueryOptions({ term, sort, page }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsListComponent />
    </HydrationBoundary>
  )
}

export default Page
