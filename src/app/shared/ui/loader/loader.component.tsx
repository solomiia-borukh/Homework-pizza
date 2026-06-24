import { LoaderCircle } from 'lucide-react'
import type { FC } from 'react'

export const Loader: FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div>
        <LoaderCircle data-testid="loader" size={40} className="animate-spin" />
      </div>
    </div>
  )
}
