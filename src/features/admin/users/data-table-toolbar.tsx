"use client"

import * as React from "react"
import { Suspense } from "react"
import type { Table } from "@tanstack/react-table"
import { PlusIcon, Trash2, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "use-debounce"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "../../../components/datatable/data-table-view-options"
import { DataTableFacetedFilter } from "../../../components/datatable/data-table-faceted-filter"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toastAlert } from "@/components/ui/sonner-v2"
import { ExportMenu } from "@/components/datatable/export-menu"

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
  debounceDelay?: number
  onDeleteSelected?: (selectedRows: TData[]) => Promise<{ success: boolean; error?: string }>
  viewMode?: string
  onViewModeChange?: (mode: string) => void
}

function DataTableToolbarContent<TData>({
                                          table,
                                          filterableColumns = [],
                                          searchableColumns = [],
                                          createQueryString,
                                          debounceDelay = 500,
                                          onDeleteSelected,
                                          viewMode = "table",
                                          onViewModeChange,
                                        }: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  // State pour la valeur de recherche locale
  const [localSearchValue, setLocalSearchValue] = React.useState(searchParams?.get("search") || "")

  // Debounce de la valeur de recherche
  const [debouncedSearchValue] = useDebounce(localSearchValue, debounceDelay)

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

  // Get selected rows
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  // Effet pour gérer la recherche debounced
  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())

    if (debouncedSearchValue) {
      newSearchParams.set("search", debouncedSearchValue)
    } else {
      newSearchParams.delete("search")
    }

    // Reset to the first page when searching
    newSearchParams.set("page", "1")

    router.push(`${pathname}?${newSearchParams.toString()}`)
  }, [debouncedSearchValue, router, pathname, searchParams])

  // Handle reset filters
  const handleResetFilters = React.useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())

    for (const key of Object.keys(filterValues)) {
      newSearchParams.delete(key)
    }

    // Reset search input
    setLocalSearchValue("")
    newSearchParams.delete("search")

    // Reset to the first page when clearing filters
    newSearchParams.set("page", "1")

    router.push(`${pathname}?${newSearchParams.toString()}`)
  }, [searchParams, filterValues, router, pathname])

  // Handle delete selected rows
  const handleDeleteSelected = React.useCallback(async () => {
    if (!onDeleteSelected) return

    try {
      const result = await onDeleteSelected(selectedRows.map((row) => row.original))

      if (!result.success) {
        throw new Error(result.error || "Échec de la suppression des éléments sélectionnés")
      }

      table.resetRowSelection()

      toastAlert.success({
        title: "Suppression réussie",
        description: `${selectedRows.length} élément${selectedRows.length > 1 ? "s" : ""} supprimé${selectedRows.length > 1 ? "s" : ""} avec succès.`,
      })
    } catch (error) {
      console.error(error)
      toastAlert.error({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de la suppression des éléments sélectionnés",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }, [onDeleteSelected, selectedRows, table])

  return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Bouton de suppression des sélections */}
          {hasSelectedRows && onDeleteSelected && (
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="h-8">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer {selectedRows.length} élément{selectedRows.length > 1 ? "s" : ""}
              </Button>
          )}

          {searchableColumns.length > 0 && (
              <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Chercher..."
                    value={localSearchValue}
                    onChange={(event) => setLocalSearchValue(event.target.value)}
                    className="h-8 w-[150px] bg-muted dark:bg-background lg:w-[250px]"
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
              <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 lg:px-3">
                Réinitialiser
                <X className="ml-2 h-4 w-4" />
              </Button>
          )}

          <Button variant="default" onClick={() => router.push("/admin/users/new")} className="h-8 px-2 lg:px-3">
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter
          </Button>

          {/* Remplacer le bouton d'export par le menu d'export */}
          <ExportMenu
              data={table.getFilteredRowModel().rows.map((row) => row.original)}
              columns={table.getAllColumns().map((column) => column.columnDef)}
              filename="utilisateurs"
          />

          <Button variant="special" onClick={() => router.push("/admin/users/import")} className="h-8 px-2 lg:px-3">
            <PlusIcon className="mr-2 h-4 w-4" />
            Importer
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <DataTableViewOptions table={table} />
        </div>

        {/* Dialog de confirmation de suppression */}
        <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteSelected}
            title="Supprimer les éléments sélectionnés"
            description={`Êtes-vous sûr de vouloir supprimer ${selectedRows.length} élément${selectedRows.length > 1 ? "s" : ""} ? Cette action est irréversible.`}
            confirmText="Supprimer"
        />
      </div>
  )
}

export function DataTableToolbar<TData>({ debounceDelay = 500, ...props }: DataTableToolbarProps<TData>) {
  return (
      <Suspense fallback={<div className="flex h-8 items-center">Chargement...</div>}>
        <DataTableToolbarContent debounceDelay={debounceDelay} {...props} />
      </Suspense>
  )
}
