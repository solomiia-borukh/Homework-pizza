'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import type { ILoginForm, IRegisterForm } from '@/app/entities/validation'
import { signIn, signUp } from '@/pkg/auth/client/auth.client'

export const useGoogleSignInMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await signIn.social({
        provider: 'google',
        callbackURL: '/items',
      })

      if (error) {
        throw new Error(error.message ?? 'Google sign in failed.')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useLoginMutation = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ email, password }: ILoginForm) => {
      const { error } = await signIn.email({ email, password })

      if (error) {
        throw new Error(error.message ?? 'Sign in failed. Please try again.')
      }
    },
    onSuccess: () => {
      toast.success('Logined successfully!')
      router.replace('/items')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useRegisterMutation = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ email, password }: IRegisterForm) => {
      const { error } = await signUp.email({
        email,
        password,
        name: email.split('@')[0],
      })

      if (error) {
        throw new Error(
          error.message ?? 'Registration failed. Please try again.',
        )
      }
    },
    onSuccess: () => {
      toast.success('Registered successfully!')
      router.replace('/items')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
