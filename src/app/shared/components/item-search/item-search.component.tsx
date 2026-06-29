'use client'

import { X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { type FC, useState } from 'react'

import { useSearchNavigate } from '@/app/shared/hooks/use-search-navigate.hook'
import { cn } from '@/pkg/theme/lib/utils'
import { Input } from '@/pkg/theme/ui/input'
import { SortFilter } from '@/pkg/theme/ui/sort-filter'

type TSort = 'newest' | 'az' | 'za'

const validSorts: TSort[] = ['newest', 'az', 'za']

const toValidSort = (value: string | null): TSort =>
  validSorts.includes(value as TSort) ? (value as TSort) : 'newest'

interface IProps {
  basePath?: string
}

export const ItemSearchComponent: FC<Readonly<IProps>> = (props) => {
  const { basePath = '/items' } = props

  const searchParams = useSearchParams()

  const [term, setTerm] = useState(searchParams.get('term') ?? '')
  const [sort, setSort] = useState<TSort>(toValidSort(searchParams.get('sort')))

  const navigate = useSearchNavigate(basePath)

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          value={term}
          placeholder="Search pizzas..."
          className={cn('w-full', term && 'pr-8')}
          onChange={(e) => {
            setTerm(e.target.value)
            navigate(e.target.value, sort)
          }}
        />
        {term && (
          <button
            type="button"
            onClick={() => {
              setTerm('')
              navigate('', sort)
            }}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <SortFilter
        value={sort}
        onChange={(val) => {
          const newSort = val as TSort

          setSort(newSort)
          navigate(term, newSort)
        }}
      />
    </div>
  )
}
