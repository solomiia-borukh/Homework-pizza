import { buttonVariants } from '@shared/ui/button'
import { cn } from '@shared/utils/cn'
import { Pizza } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'

const NotFoundPage: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <Pizza className="size-12 text-muted-foreground" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link href="/items" className={cn(buttonVariants())}>
        Browse pizzas
      </Link>
    </div>
  )
}

export default NotFoundPage
