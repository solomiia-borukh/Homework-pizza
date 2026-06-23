'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

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
import { registerSchema } from '@/app/shared/validation'
import { signUp } from '@/pkg/auth/auth-client'

import type { RegisterValues } from './register-form.interface'

export const RegisterForm: FC = () => {
  const router = useRouter()
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ email, password }: RegisterValues) => {
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
  const isFormValid = registerSchema.safeParse(values).success

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
