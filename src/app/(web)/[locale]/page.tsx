import { type NextPage } from 'next'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { authServer } from '@/pkg/auth/server'

interface IProps {
  params: Promise<{ locale: string }>
}

const Page: NextPage<Readonly<IProps>> = async (props: IProps) => {
  const { params } = props

  const { locale } = await params

  setRequestLocale(locale)

  const session = await authServer.getSession()

  redirect(session ? '/items' : '/sign-in')
}

export default Page
