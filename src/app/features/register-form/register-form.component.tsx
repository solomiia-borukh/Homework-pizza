'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@shared/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/form'
import { Input } from '@shared/components/input'
import { PasswordInput } from '@shared/components/password-input'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { SRegisterForm } from '@/app/entities/validation'
import { signUp } from '@/pkg/auth/client/auth.client'

import type { IRegisterForm } from './register-form.interface'

export const RegisterFormComponent: FC = () => {
  const router = useRouter()
  const form = useForm<IRegisterForm>({
    resolver: zodResolver(SRegisterForm),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  const { mutate, isPending } = useMutation({
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

  const { handleSubmit, control } = form

  const values = useWatch({ control })
  const isFormValid = SRegisterForm.safeParse(values).success

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="grid gap-1"
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
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending || !isFormValid}>
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </Form>
  )
}
