"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const filterSchema = z.object({
  status: z.string(),
  search: z.string(),
  serviceType: z.string(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
})

type FilterValues = z.infer<typeof filterSchema>

type AppointmentRequestsFiltersProps = {
  filters: any
  onFilterChange: (filters: any) => void
}

export function AppointmentRequestsFilters({ filters, onFilterChange }: AppointmentRequestsFiltersProps) {
  const [date, setDate] = useState<{
    from?: Date
    to?: Date
  }>({
    from: filters.dateRange?.from,
    to: filters.dateRange?.to,
  })

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: filters.status || "ALL",
      search: filters.search || "",
      serviceType: filters.serviceType || "",
      dateRange: {
        from: filters.dateRange?.from,
        to: filters.dateRange?.to,
      },
    },
  })

  function onSubmit(data: FilterValues) {
    onFilterChange({
      ...data,
      dateRange: date,
    })
  }

  const resetFilters = () => {
    form.reset({
      status: "ALL",
      search: "",
      serviceType: "",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    })
    setDate({
      from: undefined,
      to: undefined,
    })
    onFilterChange({
      status: "ALL",
      search: "",
      serviceType: "",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    })
  }

  const activeFiltersCount = [
    filters.status !== "ALL" ? 1 : 0,
    filters.search ? 1 : 0,
    filters.serviceType ? 1 : 0,
    filters.dateRange?.from ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        onFilterChange({ status: value })
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="ACCEPTED">Acceptées</SelectItem>
                        <SelectItem value="REJECTED">Rejetées</SelectItem>
                        <SelectItem value="TRANSFERRED">Transférées</SelectItem>
                        <SelectItem value="COMPLETED">Complétées</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        onFilterChange({ serviceType: value })
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les services" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL_SERVICES">Tous les services</SelectItem>
                        <SelectItem value="GENERAL_PRACTICE">Médecine générale</SelectItem>
                        <SelectItem value="OPHTHALMOLOGY">Ophtalmologie</SelectItem>
                        <SelectItem value="CARDIOLOGY">Cardiologie</SelectItem>
                        <SelectItem value="PEDIATRICS">Pédiatrie</SelectItem>
                        <SelectItem value="DERMATOLOGY">Dermatologie</SelectItem>
                        <SelectItem value="NEUROLOGY">Neurologie</SelectItem>
                        <SelectItem value="ORTHOPEDICS">Orthopédie</SelectItem>
                        <SelectItem value="GYNECOLOGY">Gynécologie</SelectItem>
                        <SelectItem value="RADIOLOGY">Radiologie</SelectItem>
                        <SelectItem value="PSYCHIATRY">Psychiatrie</SelectItem>
                        <SelectItem value="UROLOGY">Urologie</SelectItem>
                        <SelectItem value="ENT">ORL</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "P", { locale: fr })} - {format(date.to, "P", { locale: fr })}
                          </>
                        ) : (
                          format(date.from, "P", { locale: fr })
                        )
                      ) : (
                        <span>Sélectionner une période</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate || {})
                        if (newDate) {
                          onFilterChange({ dateRange: newDate })
                        }
                      }}
                      numberOfMonths={2}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                {date?.from && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => {
                      setDate({})
                      onFilterChange({ dateRange: {} })
                    }}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Rechercher..."
                          className="pl-8"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            // Debounce search
                            const timeoutId = setTimeout(() => {
                              onFilterChange({ search: e.target.value })
                            }, 500)
                            return () => clearTimeout(timeoutId)
                          }}
                        />
                      </FormControl>
                      {field.value && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => {
                            field.onChange("")
                            onFilterChange({ search: "" })
                          }}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                  {filters.status !== "ALL" && (
                    <Badge variant="outline" className="text-xs">
                      Statut:{" "}
                      {filters.status === "PENDING"
                        ? "En attente"
                        : filters.status === "ACCEPTED"
                          ? "Acceptées"
                          : filters.status === "REJECTED"
                            ? "Rejetées"
                            : filters.status === "TRANSFERRED"
                              ? "Transférées"
                              : "Complétées"}
                    </Badge>
                  )}
                  {filters.serviceType && (
                    <Badge variant="outline" className="text-xs">
                      Service:{" "}
                      {filters.serviceType === "GENERAL_PRACTICE"
                        ? "Médecine générale"
                        : filters.serviceType === "OPHTHALMOLOGY"
                          ? "Ophtalmologie"
                          : filters.serviceType === "CARDIOLOGY"
                            ? "Cardiologie"
                            : filters.serviceType === "PEDIATRICS"
                              ? "Pédiatrie"
                              : filters.serviceType === "DERMATOLOGY"
                                ? "Dermatologie"
                                : filters.serviceType === "NEUROLOGY"
                                  ? "Neurologie"
                                  : filters.serviceType === "ORTHOPEDICS"
                                    ? "Orthopédie"
                                    : filters.serviceType === "GYNECOLOGY"
                                      ? "Gynécologie"
                                      : filters.serviceType === "RADIOLOGY"
                                        ? "Radiologie"
                                        : filters.serviceType === "PSYCHIATRY"
                                          ? "Psychiatrie"
                                          : filters.serviceType === "UROLOGY"
                                            ? "Urologie"
                                            : "ORL"}
                    </Badge>
                  )}
                  {filters.search && (
                    <Badge variant="outline" className="text-xs">
                      Recherche: {filters.search}
                    </Badge>
                  )}
                  {filters.dateRange?.from && (
                    <Badge variant="outline" className="text-xs">
                      Période: {format(new Date(filters.dateRange.from), "P", { locale: fr })}
                      {filters.dateRange.to && ` - ${format(new Date(filters.dateRange.to), "P", { locale: fr })}`}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
