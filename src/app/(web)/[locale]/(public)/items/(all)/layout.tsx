import Link from 'next/link'
import type { FC, PropsWithChildren } from 'react'
import { Suspense } from 'react'

import { ItemSearchComponent } from '@/app/shared/components/item-search'
import { authServer } from '@/pkg/auth/server'
import { ThemeToggle } from '@/pkg/theme'
import { Button } from '@/pkg/theme/ui/button'

const Layout: FC<PropsWithChildren> = async (props) => {
  const { children } = props

  const session = await authServer.getSession()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:px-8">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">All Pizzas</h1>
            <ThemeToggle />
          </div>
          {session && (
            <Button asChild variant="ghost">
              <Link href="/favorites">My Favorites</Link>
            </Button>
          )}
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
