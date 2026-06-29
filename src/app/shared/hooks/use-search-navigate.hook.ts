'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

export const useSearchNavigate = (basePath: string) => {
  const router = useRouter()

  return useDebounceCallback(
    useCallback(
      (term: string, sort: string) => {
        const params = new URLSearchParams()

        if (term) params.set('term', term)
        if (sort !== 'newest') params.set('sort', sort)
        params.set('page', '1')

        router.push(`${basePath}?${params.toString()}`)
      },
      [basePath, router],
    ),
    300,
  )
}
