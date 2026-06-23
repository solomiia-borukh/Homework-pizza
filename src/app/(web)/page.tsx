import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/pkg/auth'

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  redirect(session ? '/items' : '/login')
}

export default Page
