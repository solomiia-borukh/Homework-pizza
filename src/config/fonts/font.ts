import { Geist, Geist_Mono } from 'next/font/google'

export const fontPrimary = Geist({
  variable: '--font-primary',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
})

export const fontSecondary = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
})
