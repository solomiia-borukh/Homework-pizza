'use client'

import Link from 'next/link'
import { type FC } from 'react'

import { useGoogleSignInMutation } from '@/app/entities/api/auth'
import { GoogleAuthButtonComponent } from '@/app/modules/sign/google-auth-button'
import { LoginFormComponent } from '@/app/modules/sign/login-form'
import { RegisterFormComponent } from '@/app/modules/sign/register-form'
import { WrapperComponent } from '@/app/shared/components/wrapper'
import { Button } from '@/pkg/theme/ui/button'

interface IProps {
  variant: 'sign-in' | 'sign-up'
}

const SignComponent: FC<Readonly<IProps>> = (props) => {
  const { variant } = props
  const { mutate, isPending } = useGoogleSignInMutation()

  const isSignIn = variant === 'sign-in'

  return (
    <WrapperComponent
      type="main"
      className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-1 p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-10"
    >
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold">
          {isSignIn ? 'Welcome back' : 'Create your account'}
        </h1>

        <p className="text-muted-foreground text-sm">
          {`${isSignIn ? 'Sign in ' : 'Sign up '}with your email and a password.`}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {isSignIn ? <LoginFormComponent /> : <RegisterFormComponent />}
        <div className="relative text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border w-full border-t" />
          </div>

          <span className="bg-background text-muted-foreground relative px-2">
            or
          </span>
        </div>

        <GoogleAuthButtonComponent onSignIn={mutate} isPending={isPending} />
      </div>

      <p className="text-muted-foreground text-center text-sm">
        {`${isSignIn ? `Don't ` : 'Already '}have an account?`}{' '}
        <Button variant="ghost" asChild>
          <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </Button>
      </p>
    </WrapperComponent>
  )
}

export default SignComponent
