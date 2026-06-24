'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { type FC, useEffect } from 'react'

import { Button, buttonVariants } from '@/app/shared/ui/button'
import { cn } from '@/pkg/utils'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage: FC<Props> = ({ error, reset }) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <AlertCircle className="size-12 text-destructive" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. You can try again or go back to the home
          page.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/items"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
