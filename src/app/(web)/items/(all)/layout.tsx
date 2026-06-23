import type { FC, PropsWithChildren } from 'react'
import { Suspense } from 'react'

import { ItemSearch } from '@/app/features/item-search'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">All Pizzas</h1>
        <Suspense>
          <ItemSearch />
        </Suspense>
      </div>
      {children}
    </main>
  )
}

export default Layout
