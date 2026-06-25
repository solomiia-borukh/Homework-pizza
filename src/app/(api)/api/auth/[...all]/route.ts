import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/pkg/auth/server'

export const { GET, POST } = toNextJsHandler(auth)
