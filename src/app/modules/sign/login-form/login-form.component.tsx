'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { useLoginMutation } from '@/app/entities/api/auth'
import type { ILoginForm } from '@/app/entities/validation'
import { SLoginForm } from '@/app/entities/validation'
import { FormInputComponent } from '@/app/shared/components/form-input'
import { Button } from '@/pkg/theme/ui/button'
import { Form } from '@/pkg/theme/ui/form'

export const LoginFormComponent: FC = () => {
  const { isPending, mutate } = useLoginMutation()

  const form = useForm<ILoginForm>({
    resolver: zodResolver(SLoginForm),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  const { handleSubmit, control } = form

  const values = useWatch({ control })
  const isFormValid = SLoginForm.safeParse(values).success

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((values) => mutate(values))}
        className="grid gap-2"
        noValidate
      >
        <FormInputComponent
          control={control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />

        <FormInputComponent
          control={control}
          name="password"
          label="Password"
          variant="password"
          autoComplete="current-password"
        />

        <Button type="submit" disabled={isPending || !isFormValid}>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </Form>
  )
}
