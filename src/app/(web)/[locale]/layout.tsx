import '@/config/styles/global.css'

import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { type FC, type ReactNode } from 'react'
import { Toaster } from 'sonner'

import { EAssetImage } from '@/app/shared/interfaces'
import { fontPrimary, fontSecondary } from '@/config/fonts'
import { routing } from '@/pkg/locale'
import { RestApiProvider } from '@/pkg/rest-api'
import { ThemeProvider } from '@/pkg/theme'

interface IProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (): Promise<Metadata> => {
  const favicon = EAssetImage.FAVICON
  const title = 'Homework'
  const description = 'Homework'
  const ogImage = EAssetImage.OG_IMAGE

  return {
    icons: { icon: favicon },
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    applicationName: title,
    openGraph: {
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description: description,
      siteName: title,
      type: 'website',
      url: process.env.NEXT_PUBLIC_CLIENT_WEB_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  }
}

const LocaleLayout: FC<Readonly<IProps>> = async (props: IProps) => {
  const { children, params } = props

  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontPrimary.className} ${fontSecondary.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <NextIntlClientProvider>
            <RestApiProvider>{children}</RestApiProvider>
          </NextIntlClientProvider>
          <Toaster position="top-right" duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
