'use client'

import { Eye, EyeOff } from 'lucide-react'
import type { FC } from 'react'
import { type ComponentProps, useState } from 'react'

import { Input } from '@/app/shared/ui/input'
import { cn } from '@/pkg/utils'

type TProps = Omit<ComponentProps<'input'>, 'type'>

export const PasswordInput: FC<TProps> = (props) => {
  const { className, ...rest } = props

  const [isVisible, setIsVisible] = useState(false)

  const toggle = () => setIsVisible((previous) => !previous)

  return (
    <div className="relative">
      <Input
        type={isVisible ? 'text' : 'password'}
        placeholder="••••••••"
        className={cn('pr-9', className)}
        {...rest}
      />
      <button
        type="button"
        onClick={toggle}
        tabIndex={-1}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
