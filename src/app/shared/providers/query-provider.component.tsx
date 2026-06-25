'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'

export const QueryProviderComponent: FC<PropsWithChildren> = (props) => {
  const { children } = props

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
