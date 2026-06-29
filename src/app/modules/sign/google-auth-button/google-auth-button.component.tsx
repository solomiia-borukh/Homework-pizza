import type { FC } from 'react'

import { GoogleIcon } from '@/app/shared/assets/google-icon'
import { Button } from '@/pkg/theme/ui/button'

interface IProps {
  isPending: boolean
  onSignIn: () => void
}

export const GoogleAuthButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { isPending, onSignIn } = props

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={onSignIn}
    >
      <GoogleIcon />
      {isPending ? 'Redirecting…' : 'Continue with Google'}
    </Button>
  )
}
