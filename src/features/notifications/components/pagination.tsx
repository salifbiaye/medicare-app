"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 1 // Number of pages to show before and after current page
    const pages = []
    
    // Always include first page
    pages.push(1)
    
    // Calculate range around current page
    let start = Math.max(2, currentPage - delta)
    let end = Math.min(totalPages - 1, currentPage + delta)
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push(-1) // -1 represents ellipsis
    }
    
    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push(-2) // -2 represents ellipsis
    }
    
    // Always include last page if it's not the first page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Première page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Page précédente</span>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageNumbers.map((pageNumber, index) => {
        // Render ellipsis
        if (pageNumber < 0) {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          )
        }
        
        // Render page number
        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageNumber)}
          >
            <span>{pageNumber}</span>
          </Button>
        )
      })}
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Page suivante</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Dernière page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 