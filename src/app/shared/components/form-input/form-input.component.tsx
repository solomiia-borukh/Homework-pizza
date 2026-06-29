import type { InputHTMLAttributes } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Input } from '@/pkg/theme/ui/input'
import { PasswordInput } from '@/pkg/theme/ui/password-input'

interface IProps<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>
  name: Path<T>
  label: string
  variant?: 'input' | 'password'
}

export const FormInputComponent = <T extends FieldValues>({
  control,
  name,
  label,
  variant = 'input',
  ...inputProps
}: IProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="grid gap-2">
          <label
            htmlFor={field.name}
            className="text-sm leading-none font-medium"
          >
            {label}
          </label>
          <div>
            {variant === 'password' ? (
              <PasswordInput id={field.name} {...inputProps} {...field} />
            ) : (
              <Input id={field.name} {...inputProps} {...field} />
            )}
            <p className="text-destructive h-4 overflow-hidden text-xs leading-4">
              {fieldState.error?.message}
            </p>
          </div>
        </div>
      )}
    />
  )
}
