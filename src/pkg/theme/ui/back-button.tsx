'use client'

import { useRouter } from 'next/navigation'
import type { FC } from 'react'

import { cn } from '../lib/utils'
import { buttonVariants } from './button'

interface IProps {
  label?: string
  className?: string
}

export const BackButton: FC<Readonly<IProps>> = (props) => {
  const { label = 'Back', className } = props

  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        `${buttonVariants({ variant: 'ghost' })} -ml-2 cursor-pointer`,
        className,
      )}
    >
      ← {label}
    </button>
  )
}
