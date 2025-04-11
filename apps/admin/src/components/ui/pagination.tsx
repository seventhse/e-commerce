import { Button } from '@/components/ui/button'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  // 如果总页数小于等于1，不显示分页
  if (totalPages <= 1) {
    return null
  }

  // 计算要显示的页码范围
  const getPageRange = () => {
    // 如果总页数小于等于最大可见页数，显示所有页码
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // 计算起始页和结束页
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    )
    let endPage = startPage + maxVisiblePages - 1

    // 如果结束页超出总页数，调整起始页和结束页
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    )
  }

  const pageRange = getPageRange()

  return (
    <div className="flex items-center space-x-2">
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <IconChevronsLeft className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IconChevronLeft className="h-4 w-4" />
      </Button>

      {pageRange.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <IconChevronRight className="h-4 w-4" />
      </Button>
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <IconChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
