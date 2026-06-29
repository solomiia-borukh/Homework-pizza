import { type NextPage } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { SignComponent } from '@/app/modules/sign'

export const metadata = {
  title: 'Sign Up',
}

interface IProps {
  params: Promise<{ locale: string }>
}

const Page: NextPage<Readonly<IProps>> = async (props: IProps) => {
  const { params } = props

  const { locale } = await params

  setRequestLocale(locale)

  return <SignComponent variant="sign-up" />
}

export default Page
