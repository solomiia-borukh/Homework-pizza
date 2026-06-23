import type { z } from 'zod'

import type { loginSchema } from '@/app/shared/validation'

export type LoginValues = z.infer<typeof loginSchema>
