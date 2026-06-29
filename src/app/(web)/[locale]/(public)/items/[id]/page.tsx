import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { NextPage } from 'next'

import { itemQueryOptions } from '@/app/entities/api/item'
import { ItemDetailComponent } from '@/app/features/item-detail'
import { getQueryClient } from '@/pkg/rest-api/servise'

interface IProps {
  params: Promise<{ id: string }>
}

const Page: NextPage<IProps> = async (props) => {
  const { params } = props
  const { id } = await params

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(itemQueryOptions(id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemDetailComponent id={id} />
    </HydrationBoundary>
  )
}

export default Page
