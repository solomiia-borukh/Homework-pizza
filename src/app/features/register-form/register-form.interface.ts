import type { z } from 'zod'

import type { registerSchema } from '@/app/shared/validation'

export type RegisterValues = z.infer<typeof registerSchema>
