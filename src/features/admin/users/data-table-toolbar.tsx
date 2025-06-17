"use client"

import * as React from "react"
import { Suspense } from "react"
import type { Table } from "@tanstack/react-table"
import { PlusIcon, Trash2, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "use-debounce"
import Link from "next/link"

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

  // STABILISER filterValues avec useMemo
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

  // STABILISER l'effet de recherche avec useCallback
  const handleSearchChange = React.useCallback(
    (searchValue: string) => {
      console.log("🔍 handleSearchChange:", searchValue)

      // UTILISER createQueryString au lieu de manipuler directement les searchParams
      const newUrl = `${pathname}?${createQueryString({
        search: searchValue || null,
        page: 1, // Reset à la page 1 lors de la recherche
      })}`

      console.log("🚀 Search navigation:", newUrl)
      router.push(newUrl)
    },
    [pathname, createQueryString, router],
  )

  // Effet pour gérer la recherche debounced - STABILISÉ
  React.useEffect(() => {
    const currentSearch = searchParams?.get("search") || ""

    // Éviter les appels inutiles
    if (debouncedSearchValue !== currentSearch) {
      handleSearchChange(debouncedSearchValue)
    }
  }, [debouncedSearchValue, handleSearchChange, searchParams])

  // STABILISER handleResetFilters avec useCallback
  const handleResetFilters = React.useCallback(() => {
    console.log("🔄 handleResetFilters")

    // Reset search input
    setLocalSearchValue("")

    // UTILISER createQueryString pour reset tous les filtres
    const paramsToReset: Record<string, string | number | null> = {
      search: null,
      page: 1, // Reset à la page 1
    }

    // Ajouter tous les filtres actifs à reset
    Object.keys(filterValues).forEach((key) => {
      paramsToReset[key] = null
    })

    const newUrl = `${pathname}?${createQueryString(paramsToReset)}`
    console.log("🚀 Reset navigation:", newUrl)
    router.push(newUrl)
  }, [filterValues, pathname, createQueryString, router])

  // STABILISER handleDeleteSelected avec useCallback
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
        {searchableColumns.length > 0 && (
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Rechercher un utilisateur..."
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

        {hasSelectedRows && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            className="h-8 px-2 lg:px-3"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer ({selectedRows.length})
          </Button>
        )}

        <ExportMenu
          data={table.getFilteredRowModel().rows.map((row) => row.original)}
          columns={table.getAllColumns().map((column) => column.columnDef)}
          filename="utilisateurs"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Link href="/admin/users/new">
          <Button variant="outline" size="sm" className="h-8">
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </Link>
        <DataTableViewOptions table={table} />
      </div>
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
