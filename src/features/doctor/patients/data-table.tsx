"use client"

import * as React from "react"
import { Suspense } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "@/components/datatable/data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
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
  totalItems: number
  pageCount: number
  defaultPageSize?: number
}

function DataTableContent<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  totalItems,
  pageCount,
  defaultPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse URL search params for table state
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1
  const pageSize = searchParams?.get("per_page") ? Number(searchParams.get("per_page")) : defaultPageSize
  const sort = searchParams?.get("sort")
  const [column, order] = sort?.split(".") ?? []

  // Get view mode from URL or default to table
  const viewMode = searchParams?.get("view") || "table"

  // Set up local state for table
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>(
    column && order ? [{ id: column, desc: order === "desc" }] : [],
  )

  // Calculate page count
  const pageCountProp = pageCount ?? Math.ceil((totalItems ?? data.length) / pageSize)

  // Create URL search params
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams],
  )

  // Handle view mode change
  const handleViewModeChange = (mode: string) => {
    router.push(`${pathname}?${createQueryString({ view: mode })}`)
  }

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    pageCount: pageCountProp,
    manualPagination: true,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        createQueryString={createQueryString}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="whitespace-nowrap text-background dark:text-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <p>
              {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} patient(s)
              sélectionné(s).
            </p>
          )}
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DataTableContent {...props} />
    </Suspense>
  )
} 