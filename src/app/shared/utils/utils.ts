import { validSorts } from '../consts'
import type { TSort } from '../interfaces'

export const toValidSort = (value: string | null): TSort =>
  validSorts.includes(value as TSort) ? (value as TSort) : 'newest'
