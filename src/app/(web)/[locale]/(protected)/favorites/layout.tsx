import Link from 'next/link'
import type { FC, PropsWithChildren } from 'react'
import { Suspense } from 'react'

import { ItemSearchComponent } from '@/app/features/item-search'
import { Button } from '@/pkg/theme/ui/button'

const Layout: FC<Readonly<PropsWithChildren>> = (props) => {
  const { children } = props

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Favorites</h1>
          <Button variant="ghost" asChild>
            <Link href="/items">All Pizzas</Link>
          </Button>
        </div>
        <Suspense>
          <ItemSearchComponent basePath="/favorites" />
        </Suspense>
      </div>
      {children}
    </main>
  )
}

export default Layout
