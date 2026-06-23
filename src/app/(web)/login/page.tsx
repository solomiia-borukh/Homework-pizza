import Link from 'next/link'
import type { FC } from 'react'

import { LoginForm } from '@/app/features/login-form'
import { SocialAuthButton } from '@/app/features/social-auth-button'

const LoginPage: FC = () => {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-10">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in with your email and password.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <LoginForm />
        <div className="relative text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border w-full border-t" />
          </div>
          <span className="bg-background text-muted-foreground relative px-2">
            or
          </span>
        </div>
        <SocialAuthButton />
      </div>
      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </main>
  )
}

export default LoginPage
