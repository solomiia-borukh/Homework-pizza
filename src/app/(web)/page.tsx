import type { NextPage } from 'next'
import { redirect } from 'next/navigation'

import { authServer } from '@/pkg/auth/server'

const Page: NextPage = async () => {
  const session = await authServer.getSession()

  redirect(session ? '/items' : '/login')
}

export default Page
