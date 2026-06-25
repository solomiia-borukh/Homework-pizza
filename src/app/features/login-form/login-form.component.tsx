'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { SLoginForm } from '@/app/entities/validation'
import { Button } from '@/app/shared/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/shared/ui/form'
import { Input } from '@/app/shared/ui/input'
import { PasswordInput } from '@/app/shared/ui/password-input'
import { signIn } from '@/pkg/auth/auth-client'

import type { ILoginForm } from './login-form.interface'

export const LoginFormComponent: FC = () => {
  const router = useRouter()
  const form = useForm<ILoginForm>({
    resolver: zodResolver(SLoginForm),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  const { isPending, mutate } = useMutation({
    mutationFn: async ({ email, password }: ILoginForm) => {
      const { error } = await signIn.email({
        email,
        password,
      })

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

  const { handleSubmit, control } = form

  const values = useWatch({ control })
  const isFormValid = SLoginForm.safeParse(values).success

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="grid gap-4"
        noValidate
      >
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending || !isFormValid}>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </Form>
  )
}
