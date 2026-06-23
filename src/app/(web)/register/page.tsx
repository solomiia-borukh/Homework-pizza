import Link from 'next/link'
import type { FC } from 'react'

import { RegisterForm } from '@/app/features/register-form'
import { SocialAuthButton } from '@/app/features/social-auth-button'

const RegisterPage: FC = () => {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-10">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Sign up with your email and a password.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <RegisterForm />
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
        Already have an account?{' '}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </main>
  )
}

export default RegisterPage
