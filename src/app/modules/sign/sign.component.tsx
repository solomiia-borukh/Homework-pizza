import Link from 'next/link'
import { type FC } from 'react'

import { LoginFormComponent } from '@/app/features/login-form'
import { RegisterFormComponent } from '@/app/features/register-form'
import { SocialAuthButtonComponent } from '@/app/features/social-auth-button'
import { WrapperComponent } from '@/app/shared/ui/wrapper'

interface IProps {
  variant: 'sign-in' | 'sign-up'
}

const SignComponent: FC<Readonly<IProps>> = (props) => {
  const { variant } = props

  return (
    <WrapperComponent
      type="main"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold">
          {variant === 'sign-in' ? 'Welcome back' : 'Create yout account'}
        </h1>

        <p className="text-muted-foreground text-sm">
          {`${variant === 'sign-in' ? 'Sign in' : 'Sign up'}with your email and a password.`}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {variant === 'sign-in' ? (
          <LoginFormComponent />
        ) : (
          <RegisterFormComponent />
        )}

        <div className="relative text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border w-full border-t" />
          </div>
          <span className="bg-background text-muted-foreground relative px-2">
            or
          </span>
        </div>
        <SocialAuthButtonComponent />
      </div>
      <p className="text-muted-foreground text-center text-sm">
        {`${variant === 'sign-in' ? 'Don&apos;t' : 'Already'}have an account?`}{' '}
        <Link
          href={variant === 'sign-in' ? '/register' : '/login'}
          className="underline underline-offset-4"
        >
          {variant === 'sign-in' ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </WrapperComponent>
  )
}

export default SignComponent
