'use client'

import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, useState } from 'react'

import { Input } from '@/app/shared/ui/input'
import { cn } from '@/pkg/utils'

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'>

const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggle = () => setIsVisible((previous) => !previous)

  return (
    <div className="relative">
      <Input
        type={isVisible ? 'text' : 'password'}
        placeholder="••••••••"
        className={cn('pr-9', className)}
        {...props}
      />
      <button
        type="button"
        onClick={toggle}
        tabIndex={-1}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export { PasswordInput }
