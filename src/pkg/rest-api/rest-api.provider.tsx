'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { FC, ReactNode } from 'react'

import { getQueryClient } from './servise'

interface IProps {
  children: ReactNode
}

export const RestApiProvider: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
