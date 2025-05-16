import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  // Générer l'array de pages
  const generatePagesArray = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage < 5) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages]
    }

    if (currentPage > totalPages - 4) {
      return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ]
  }

  const pages = generatePagesArray()

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Page précédente</span>
      </Button>

      {pages.map((page, i) => {
        if (page === "ellipsis") {
          return (
            <Button key={`ellipsis-${i}`} variant="ghost" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Page suivante</span>
      </Button>
    </div>
  )
} 