'use client'

import { Eye, EyeOff } from 'lucide-react'
import type { FC } from 'react'
import { type ComponentProps, useState } from 'react'

import { cn } from '@/pkg/theme/lib/utils'

import { Input } from './input'

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
        className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center px-2.5 transition-colors"
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
