"use client"

import * as React from "react"
import { Suspense } from "react"
import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: {
    id: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  searchableColumns?: {
    id: string
    title: string
  }[]
  createQueryString: (params: Record<string, string | number | null>) => string
}

function DataTableToolbarContent<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  createQueryString,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get all the unique filter values from the URL
  const filterValues = React.useMemo(() => {
    const values: Record<string, string[]> = {}

    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        if (filterableColumns.some((column) => column.id === key)) {
          if (!values[key]) {
            values[key] = []
          }
          values[key].push(value)
        }
      }
    }

    return values
  }, [searchParams, filterableColumns])

  // Count the active filters
  const activeFiltersCount = Object.values(filterValues).flat().length

  // Handle global search
  const searchValue = searchParams?.get("search") || ""

  const handleSearch = React.useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      if (value) {
        newSearchParams.set("search", value)
      } else {
        newSearchParams.delete("search")
      }

      // Reset to the first page when searching
      newSearchParams.set("page", "1")

      router.push(`${pathname}?${newSearchParams.toString()}`)
    },
    [searchParams, router, pathname],
  )

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 && (
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(event) => handleSearch(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        )}
        {filterableColumns.length > 0 &&
          filterableColumns.map((column) => (
            <DataTableFacetedFilter
              key={column.id}
              column={table.getColumn(column.id)}
              title={column.title}
              options={column.options}
              createQueryString={createQueryString}
            />
          ))}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              const newSearchParams = new URLSearchParams(searchParams?.toString())

              for (const key of Object.keys(filterValues)) {
                newSearchParams.delete(key)
              }

              // Reset to the first page when clearing filters
              newSearchParams.set("page", "1")

              router.push(`${pathname}?${newSearchParams.toString()}`)
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  return (
    <Suspense fallback={<div>Loading toolbar...</div>}>
      <DataTableToolbarContent {...props} />
    </Suspense>
  )
}
