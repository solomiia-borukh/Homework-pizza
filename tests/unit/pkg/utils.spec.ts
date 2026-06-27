import { describe, expect, test } from 'vitest'

import { cn } from '@/pkg/theme/lib/utils'

const isPenging = false

describe('cn', () => {
  test('it merges conflicting tailwind classes, keeping the last', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  test('it drops falsy values and joins the rest', () => {
    expect(cn(isPenging && 'text-red', 'text-sm', false, 'font-medium')).toBe(
      'text-sm font-medium',
    )
  })
})
