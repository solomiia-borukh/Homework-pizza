'use client'

import { useState } from 'react'

import { GoogleIcon } from '@/app/shared/assets/google-icon'
import { signIn } from '@/pkg/auth/client/auth.client'
import { Button } from '@/pkg/theme/ui/button'

export const SocialAuthButtonComponent = () => {
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    try {
      await signIn.social({ provider: 'google', callbackURL: '/items' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={handleClick}
    >
      <GoogleIcon />
      {isPending ? 'Redirecting…' : 'Continue with Google'}
    </Button>
  )
}
