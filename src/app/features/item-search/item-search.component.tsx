'use client'

import { Input } from '@shared/ui/input'
import { SortFilterComponent } from '@shared/ui/sort-filter'
import { cn } from '@shared/utils/cn'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

interface ISearchValues {
  term: string
  sort: 'newest' | 'az' | 'za'
}

const validSorts: ISearchValues['sort'][] = ['newest', 'az', 'za']

const toValidSort = (value: string | null): ISearchValues['sort'] =>
  validSorts.includes(value as ISearchValues['sort'])
    ? (value as ISearchValues['sort'])
    : 'newest'

interface IProps {
  basePath?: string
}

export const ItemSearchComponent: FC<Readonly<IProps>> = (props) => {
  const { basePath = '/items' } = props

  const router = useRouter()
  const searchParams = useSearchParams()

  const { register, control, setValue } = useForm<ISearchValues>({
    defaultValues: {
      term: searchParams.get('term') ?? '',
      sort: toValidSort(searchParams.get('sort')),
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
      <SortFilterComponent
        value={sort ?? 'newest'}
        onChange={(val) => setValue('sort', val as ISearchValues['sort'])}
      />
    </div>
  )
}
