'use client'

import { useRouter } from 'next/navigation'
import type { FC } from 'react'

import { buttonVariants } from '@/app/shared/ui/button'
import { cn } from '@/pkg/utils'

interface Props {
  label?: string
}

export const BackButton: FC<Props> = ({ label = 'Back' }) => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        '-ml-2 cursor-pointer',
      )}
    >
      ← {label}
    </button>
  )
}
