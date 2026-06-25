import { z } from 'zod'

const email = z
  .string()
  .trim()
  .min(1, 'Email is required!')
  .email('Invalid email address!')

const password = z.string().trim().min(1, 'Password is required!')

const strongPassword = z
  .string()
  .trim()
  .min(8, 'Password should have at least 8 characters!')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter!')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter!')
  .regex(/\d/, 'Password must contain at least one number!')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character!')

export const SLoginForm = z.object({ email, password })
export const SRegisterForm = z.object({ email, password: strongPassword })

export type ILoginForm = z.infer<typeof SLoginForm>
export type IRegisterForm = z.infer<typeof SRegisterForm>
