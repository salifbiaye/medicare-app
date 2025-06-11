"use client"

import * as React from "react"
import { Suspense } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
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
import { DataTablePagination } from "../../../components/datatable/data-table-pagination"
import { deleteMultipleUsersAction } from "@/actions/user.action"
import {DataTableToolbar} from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterableColumns?: {
    id: string
    title: string
    options: {
      label: string
      value: string
    }[]
  }[]
  searchableColumns?: {
    id: string
    title: string
  }[]
  totalItems?: number
  pageCount?: number
  defaultPageSize?: number
}

function DataTableContent<TData, TValue>({
                                           columns,
                                           data,
                                           filterableColumns = [],
                                           searchableColumns = [],
                                           totalItems,
                                           pageCount: pageCountProp,
                                           defaultPageSize = 10,
                                         }: DataTableProps<TData, TValue>) {
  "use no memo";
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Parse URL search params for table state
  const currentPage = searchParams?.get("page") ? Number(searchParams.get("page")) : 1
  const currentPageSize = searchParams?.get("per_page") ? Number(searchParams.get("per_page")) : defaultPageSize
  const sort = searchParams?.get("sort")
  const [column, order] = sort?.split(".") ?? []

  // Get view mode from URL or default to table
  const viewMode = searchParams?.get("view") || "table"

  // Set up local state for table
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  // État de sorting synchronisé avec l'URL
  const [sorting, setSorting] = React.useState<SortingState>(() =>
      column && order ? [{ id: column, desc: order === "desc" }] : []
  )

  // Synchroniser le sorting avec les changements d'URL
  React.useEffect(() => {
    if (column && order) {
      setSorting([{ id: column, desc: order === "desc" }])
    } else {
      setSorting([])
    }
  }, [column, order])

  // État de pagination avec gestion de la persistance
  const [pagination, setPagination] = React.useState({
    pageIndex: Math.max(0, currentPage - 1),
    pageSize: Math.max(1, currentPageSize),
  })

  // Synchronisation avec l'URL
  React.useEffect(() => {
    const newPagination = {
      pageIndex: Math.max(0, currentPage - 1),
      pageSize: Math.max(1, currentPageSize),
    }
    setPagination(newPagination)
  }, [currentPage, currentPageSize])

  // Calculate page count avec validation
  const pageCount = Math.max(1, Math.ceil((totalItems ?? data.length) / currentPageSize))

  const handleDeleteSelected = async (selectedRows: TData[]) => {
    try {
      // Vérifier que deleteMultipleUsersAction existe et que les rows ont des ids
      if (!selectedRows.length) return { success: false, error: "Aucun élément sélectionné" }

      const ids: string[] = selectedRows
          .map(row => (row as any)?.id)
          .filter(id => id !== undefined)

      if (!ids.length) return { success: false, error: "Aucun ID valide trouvé" }

      // Vérifier que la fonction deleteMultipleUsersAction existe
      if (typeof deleteMultipleUsersAction !== 'function') {
        console.error("deleteMultipleUsersAction n'est pas définie")
        return { success: false, error: "Fonction de suppression non disponible" }
      }

      await deleteMultipleUsersAction(ids)

      // Réinitialiser la sélection après suppression
      setRowSelection({})

      return { success: true }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      return {
        success: false,
        error: "Impossible de supprimer les éléments sélectionnés"
      }
    }
  }

  // Create URL search params avec validation
  const createQueryString = React.useCallback(
      (params: Record<string, string | number | null>) => {
        const newSearchParams = new URLSearchParams(searchParams?.toString() || "")

        for (const [key, value] of Object.entries(params)) {
          if (value === null || value === undefined || value === "") {
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
  const handleViewModeChange = React.useCallback((mode: string) => {
    if (mode !== viewMode) {
      router.push(`${pathname}?${createQueryString({ view: mode })}`)
    }
  }, [viewMode, router, pathname, createQueryString])

  // Handler pour la pagination - avec gestion de la persistance
  const handlePaginationChange = React.useCallback((updater: any) => {
    const newPagination = typeof updater === "function" ? updater(pagination) : updater
    
    // Valider les nouvelles valeurs
    const newPageIndex = Math.max(0, Math.min(newPagination.pageIndex, pageCount - 1))
    const newPageSize = Math.max(1, newPagination.pageSize)
    const newPage = newPageIndex + 1

    // Mettre à jour l'état local immédiatement
    setPagination({
      pageIndex: newPageIndex,
      pageSize: newPageSize,
    })

    // Mettre à jour l'URL avec scroll: false pour éviter le rechargement
    router.push(
      `${pathname}?${createQueryString({
        page: newPage,
        per_page: newPageSize,
      })}`,
      { scroll: false }
    )
  }, [pagination, router, pathname, createQueryString, pageCount])

  // Handler pour le sorting avec prévention des boucles
  const handleSortingChange = React.useCallback((updater: any) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater

    // Vérifier si le sorting a réellement changé
    const currentSortString = sorting.length > 0 ? `${sorting[0].id}.${sorting[0].desc ? "desc" : "asc"}` : ""
    const newSortString = newSorting.length > 0 ? `${newSorting[0].id}.${newSorting[0].desc ? "desc" : "asc"}` : ""

    if (currentSortString !== newSortString) {
      setSorting(newSorting)

      // Update URL with sort params
      if (newSorting.length > 0) {
        const { id, desc } = newSorting[0]
        const order = desc ? "desc" : "asc"
        router.push(`${pathname}?${createQueryString({ sort: `${id}.${order}` })}`)
      } else {
        router.push(`${pathname}?${createQueryString({ sort: null })}`)
      }
    }
  }, [sorting, router, pathname, createQueryString])

  // Initialize table avec gestion de la persistance
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onPaginationChange: handlePaginationChange,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount,
    manualPagination: true,
  })

  return (
      <div className="space-y-4">
        <DataTableToolbar
            table={table}
            filterableColumns={filterableColumns}
            searchableColumns={searchableColumns}
            createQueryString={createQueryString}
            onDeleteSelected={handleDeleteSelected}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
        />
        <div className="rounded-[10px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="rounded-[10px] border border-border" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="whitespace-nowrap text-background dark:text-foreground">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                  </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                          className="bg-muted dark:bg-background/90 border-2"
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
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
                  {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
                  sélectionnée(s).
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
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTableContent {...props} />
      </Suspense>
  )
}