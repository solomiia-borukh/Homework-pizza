import { Button } from '@shared/components/button'
import { cn } from '@shared/utils/cn'
import type { FC } from 'react'

interface IProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PaginationComponent: FC<Readonly<IProps>> = (props) => {
  const { currentPage, totalPages, onPageChange } = props

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? 'default' : 'outline'}
          size="sm"
          className={cn(p === currentPage && 'pointer-events-none')}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </Button>
    </div>
  )
}
