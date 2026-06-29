'use client'

import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { favoritesQueryOptions } from '@/app/entities/api/favorite/favorites.query'

interface IProps {
  itemId: string
  initialCount: number
}

export const FavoriteCountComponent: FC<Readonly<IProps>> = (props) => {
  const { itemId, initialCount } = props

  const [count, setCount] = useState(initialCount)
  const { data: favorites, isSuccess } = useQuery(favoritesQueryOptions())

  const isFavorited = favorites?.itemIds.includes(itemId) ?? false
  const initializedRef = useRef(false)
  const prevIsFavoritedRef = useRef(false)

  useEffect(() => {
    if (!isSuccess) return

    if (!initializedRef.current) {
      initializedRef.current = true
      prevIsFavoritedRef.current = isFavorited

      return
    }

    if (prevIsFavoritedRef.current !== isFavorited) {
      setCount((prev) => (isFavorited ? prev + 1 : prev - 1))
      prevIsFavoritedRef.current = isFavorited
    }
  }, [isFavorited, isSuccess])

  return (
    <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
      <Heart className="size-4" />
      {count}
    </span>
  )
}
