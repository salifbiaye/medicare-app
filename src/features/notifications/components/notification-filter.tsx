"use client"
import { Button } from "@/components/ui/button"
import { SelectGroup, SelectItem, SelectTrigger, SelectValue, Select, SelectContent } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {Checkbox} from "@/components/ui/checkbox";

interface NotificationFilterProps {
  typeFilter: string[]
  priorityFilter: string[]
  categoryFilter: string[]
  onTypeFilterChange: (types: string[]) => void
  onPriorityFilterChange: (priorities: string[]) => void
  onCategoryFilterChange: (categories: string[]) => void
  clearFilters: () => void
  hasFilters: boolean
}

export function NotificationFilter({
  typeFilter,
  priorityFilter,
  categoryFilter,
  onTypeFilterChange,
  onPriorityFilterChange,
  onCategoryFilterChange,
  clearFilters,
  hasFilters,
}: NotificationFilterProps) {

  const typeOptions = [
    { value: "INFO", label: "Info" },
    { value: "WARNING", label: "Alerte" },
    { value: "SUCCESS", label: "Succès" },
    { value: "ERROR", label: "Erreur" },
    { value: "MESSAGE", label: "Message" },
    { value: "APPOINTMENT", label: "Rendez-vous" },
    { value: "DOCUMENT", label: "Document" },
    { value: "SYSTEM", label: "Système" },
    { value: "PRESCRIPTION", label: "Prescription" },
    { value: "LAB", label: "Laboratoire" },
    { value: "VITAL", label: "Vital" },
  ]

  const priorityOptions = [
    { value: "LOW", label: "Basse" },
    { value: "MEDIUM", label: "Moyenne" },
    { value: "HIGH", label: "Haute" },
    { value: "URGENT", label: "Urgente" },
  ]

  const categoryOptions = [
    { value: "MEDICAL", label: "Médical" },
    { value: "ADMINISTRATIVE", label: "Administratif" },
    { value: "SYSTEM", label: "Système" },
  ]

  // Gérer le changement de filtre
  const handleTypeChange = (value: string) => {
    const newTypes =
      value === "all"
        ? []
        : typeFilter.includes(value)
          ? typeFilter.filter((type) => type !== value)
          : [...typeFilter, value]

    onTypeFilterChange(newTypes)
  }


  const handleCategoryChange = (value: string) => {
    const newCategories =
      value === "all"
        ? []
        : categoryFilter.includes(value)
          ? categoryFilter.filter((category) => category !== value)
          : [...categoryFilter, value]

    onCategoryFilterChange(newCategories)
  }

  // Afficher les filtres actifs
  const getActiveFilters = () => {
    const filters = [
      ...typeFilter.map((type) => {
        const option = typeOptions.find((opt) => opt.value === type)
        return option ? { value: type, label: `Type: ${option.label}` } : null
      }),
      ...priorityFilter.map((priority) => {
        const option = priorityOptions.find((opt) => opt.value === priority)
        return option ? { value: priority, label: `Priorité: ${option.label}` } : null
      }),
      ...categoryFilter.map((category) => {
        const option = categoryOptions.find((opt) => opt.value === category)
        return option ? { value: category, label: `Catégorie: ${option.label}` } : null
      }),
    ].filter(Boolean) as { value: string; label: string }[]

    return filters
  }

  const activeFilters = getActiveFilters()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Filtre de type */}
        <Select
          value={typeFilter.length > 0 ? typeFilter[0] : "all"}
          onValueChange={(value) =>
            onTypeFilterChange(value === "all" ? [] : [value])
          }
        >
          <SelectTrigger className="h-9 w-auto bg-gray-700 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tous les types</SelectItem>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Filtre de priorité */}
        <Select

            value={priorityFilter.length > 0 ? priorityFilter[0] : "all"}
            onValueChange={(value) =>
                onPriorityFilterChange(value === "all" ? [] : [value])
            }
        >
          <SelectTrigger className="h-9 w-auto bg-gray-700 text-white">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Toutes les priorités</SelectItem>
              {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
            value={categoryFilter.length > 0 ? categoryFilter[0] : "all"}
            onValueChange={(value) =>
                onCategoryFilterChange(value === "all" ? [] : [value])
            }
        >
          <SelectTrigger className="h-9 w-auto bg-gray-700 text-white">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Bouton pour réinitialiser les filtres */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Afficher les filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter.value} variant="secondary" className="flex items-center gap-1">
              {filter.label}
              <button
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                onClick={() => {
                  if (typeFilter.includes(filter.value)) {
                    onTypeFilterChange(typeFilter.filter((t) => t !== filter.value))
                  } else if (priorityFilter.includes(filter.value)) {
                    onPriorityFilterChange(priorityFilter.filter((p) => p !== filter.value))
                  } else if (categoryFilter.includes(filter.value)) {
                    onCategoryFilterChange(categoryFilter.filter((c) => c !== filter.value))
                  }
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          ))}

          {activeFilters.length > 1 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
              Tout effacer
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
