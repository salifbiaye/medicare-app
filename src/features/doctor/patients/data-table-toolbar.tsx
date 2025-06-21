"use client"

import * as React from "react"
import { Suspense } from "react"
import type { Table } from "@tanstack/react-table"
import { PlusIcon, X, CheckCircle2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "use-debounce"
import { toastAlert } from "@/components/ui/sonner-v2"
import { PatientWithUser } from "./columns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/datatable/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/datatable/data-table-faceted-filter"
import { ExportMenu } from "@/components/datatable/export-menu"
import { updateMultipleAppointmentRequestsStatusAction } from "@/actions/appointment-request.action"
import Link from "next/link"

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
  viewMode?: string
  onViewModeChange?: (mode: string) => void
}

function DataTableToolbarContent<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  createQueryString,
  debounceDelay = 500,
  viewMode = "table",
  onViewModeChange,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State pour la valeur de recherche locale
  const [localSearchValue, setLocalSearchValue] = React.useState(searchParams?.get("search") || "")

  // Debounce de la valeur de recherche
  const [debouncedSearchValue] = useDebounce(localSearchValue, debounceDelay)

  // Get all the unique filter values from the URL - STABILISÉ avec useMemo
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

  // STABILISER handleSearchChange avec useCallback
  const handleSearchChange = React.useCallback(
    (searchValue: string) => {
      const newUrl = `${pathname}?${createQueryString({
        search: searchValue || null,
        page: 1, // Reset à la page 1 lors de la recherche
      })}`
      router.push(newUrl)
    },
    [pathname, createQueryString, router],
  )

  // Effet pour gérer la recherche debounced - STABILISÉ
  React.useEffect(() => {
    const currentSearch = searchParams?.get("search") || ""
    if (debouncedSearchValue !== currentSearch) {
      handleSearchChange(debouncedSearchValue)
    }
  }, [debouncedSearchValue, handleSearchChange, searchParams])

  // STABILISER handleResetFilters avec useCallback
  const handleResetFilters = React.useCallback(() => {
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
    router.push(newUrl)
  }, [filterValues, pathname, createQueryString, router])

  // STABILISER handleMarkSelectedAsCompleted avec useCallback
  const handleMarkSelectedAsCompleted = React.useCallback(async () => {
    try {
      const selectedPatientIds = selectedRows.map(row => (row.original as PatientWithUser).userId)
      const result = await updateMultipleAppointmentRequestsStatusAction(selectedPatientIds, "COMPLETED")
      
      if (result.success) {
        toastAlert.success({
          title: "Demandes complétées",
          description: `Toutes les demandes de rendez-vous des ${selectedPatientIds.length} patient(s) sélectionné(s) ont été marquées comme complétées.`
        })
        table.resetRowSelection()
      } else {
        toastAlert.error({
          title: "Erreur",
          description: "Impossible de marquer les demandes comme complétées."
        })
      }
    } catch (error) {
      toastAlert.error({
        title: "Erreur",
        description: "Une erreur est survenue."
      })
    }
  }, [selectedRows, table])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 && (
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Rechercher un patient..."
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
            onClick={handleMarkSelectedAsCompleted}
            className="h-8 px-2 lg:px-3"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Marquer comme complété ({selectedRows.length})
          </Button>
        )}

        <ExportMenu
          data={table.getFilteredRowModel().rows.map((row) => row.original)}
          columns={table.getAllColumns().map((column) => column.columnDef)}
          filename="patients"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Link href="/doctor/patients/new">
          <Button variant="outline" size="sm" className="h-8">
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter un patient
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