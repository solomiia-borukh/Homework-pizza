'use client'

import { useRouter } from 'next/navigation'
import type { FC } from 'react'

import { buttonVariants } from '@/app/shared/ui/button'

interface IProps {
  label?: string
}

export const BackButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { label = 'Back' } = props

  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`${buttonVariants({ variant: 'ghost' })} -ml-2 cursor-pointer`}
    >
      ← {label}
    </button>
  )
}
