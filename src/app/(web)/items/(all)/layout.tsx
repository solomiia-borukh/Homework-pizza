import { buttonVariants } from '@shared/components/button'
import { cn } from '@shared/utils/cn'
import Link from 'next/link'
import type { FC, PropsWithChildren } from 'react'
import { Suspense } from 'react'

import { ItemSearchComponent } from '@/app/features/item-search'

const Layout: FC<PropsWithChildren> = (props) => {
  const { children } = props

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Pizzas</h1>
          <Link
            href="/favorites"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            My Favorites
          </Link>
        </div>
        <Suspense>
          <ItemSearchComponent />
        </Suspense>
      </div>
      {children}
    </main>
  )
}

export default Layout
