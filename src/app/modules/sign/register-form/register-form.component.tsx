'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { useRegisterMutation } from '@/app/entities/api/auth'
import type { IRegisterForm } from '@/app/entities/validation'
import { SRegisterForm } from '@/app/entities/validation'
import { FormInputComponent } from '@/app/shared/components/form-input'
import { Button } from '@/pkg/theme/ui/button'
import { Form } from '@/pkg/theme/ui/form'

export const RegisterFormComponent: FC = () => {
  const { mutate, isPending } = useRegisterMutation()
  const form = useForm<IRegisterForm>({
    resolver: zodResolver(SRegisterForm),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  const { handleSubmit, control } = form

  const values = useWatch({ control })
  const isFormValid = SRegisterForm.safeParse(values).success

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
          autoComplete="new-password"
        />

        <Button type="submit" disabled={isPending || !isFormValid}>
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </Form>
  )
}
