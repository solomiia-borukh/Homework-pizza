'use client'

import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { Input } from '@/app/shared/ui/input'
import { SortFilter } from '@/app/shared/ui/sort-filter'
import { cn } from '@/pkg/utils'

type SearchValues = {
  term: string
  sort: 'newest' | 'az' | 'za'
}

interface Props {
  basePath?: string
}

export const ItemSearch: FC<Props> = ({ basePath = '/items' }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { register, control, setValue } = useForm<SearchValues>({
    defaultValues: {
      term: searchParams.get('term') ?? '',
      sort: (searchParams.get('sort') as SearchValues['sort']) ?? 'newest',
    },
  })

  const { term, sort } = useWatch({ control })

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams()

      if (term) params.set('term', term)
      if (sort && sort !== 'newest') params.set('sort', sort)
      params.set('page', '1')

      router.push(`${basePath}?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeout)
  }, [term, sort, router, basePath])

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          {...register('term')}
          placeholder="Search pizzas..."
          className={cn('w-full', term && 'pr-8')}
        />
        {term && (
          <button
            type="button"
            onClick={() => setValue('term', '')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <SortFilter
        value={sort ?? 'newest'}
        onChange={(val) => setValue('sort', val as SearchValues['sort'])}
      />
    </div>
  )
}
