import {
  defaultShouldDehydrateQuery,
  keepPreviousData,
  QueryClient,
} from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined = undefined

const isServer = typeof window === 'undefined'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => {
          return (
            defaultShouldDehydrateQuery(query) ||
            query.state.status === 'pending'
          )
        },
      },
    },
  })
}

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()

    return browserQueryClient
  }
}
