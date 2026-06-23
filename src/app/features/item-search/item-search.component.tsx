'use client'

import { Menu } from '@base-ui/react/menu'
import { ArrowUpDown, Check, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/app/shared/ui/button'
import { Input } from '@/app/shared/ui/input'
import { cn } from '@/pkg/utils'

type SearchValues = {
  term: string
  sort: 'newest' | 'az' | 'za'
}

const SORT_OPTIONS: { value: SearchValues['sort']; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

export const ItemSearch: FC = () => {
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

      router.push(`/items?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeout)
  }, [term, sort, router])

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
      <Menu.Root>
        <Menu.Trigger
          render={
            <Button variant="outline" size="icon" aria-label="Sort options">
              <ArrowUpDown />
            </Button>
          }
        />
        <Menu.Portal>
          <Menu.Positioner align="end" sideOffset={4}>
            <Menu.Popup className="z-50 min-w-36 rounded-lg border border-border bg-popover p-1 shadow-md outline-none">
              <Menu.RadioGroup
                value={sort ?? 'newest'}
                onValueChange={(value) =>
                  setValue('sort', value as SearchValues['sort'])
                }
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <Menu.RadioItem
                    key={value}
                    value={value}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-1.5 text-sm outline-none',
                      'hover:bg-muted',
                      sort === value && 'font-medium text-primary',
                    )}
                  >
                    {label}
                    <Menu.RadioItemIndicator>
                      <Check className="size-3.5" />
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  )
}
