'use client'

import { Menu } from '@base-ui/react/menu'
import { Button } from '@shared/ui/button'
import { cn } from '@shared/utils/cn'
import { ArrowUpDown, Check } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'

interface IOption {
  value: string
  label: string
}

interface IProps {
  options?: IOption[]
  value: string
  onChange: (value: string) => void
}

const defaultOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

export const SortFilterComponent: FC<Readonly<IProps>> = (props) => {
  const { options = defaultOptions, value, onChange } = props

  const [open, setOpen] = useState(false)

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger
        render={
          <Button variant="outline" size="icon" aria-label="Sort options">
            <ArrowUpDown />
          </Button>
        }
      />
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={4} style={{ zIndex: 9999 }}>
          <Menu.Popup className="min-w-36 rounded-lg border border-border bg-popover p-1 shadow-md outline-none">
            <Menu.RadioGroup
              value={value}
              onValueChange={(val) => {
                onChange(val)
                setOpen(false)
              }}
            >
              {options.map((option) => (
                <Menu.RadioItem
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-1.5 text-sm outline-none',
                    'hover:bg-muted',
                    value === option.value && 'font-medium text-primary',
                  )}
                >
                  {option.label}
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
  )
}
