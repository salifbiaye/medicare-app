"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import { NotificationHeader } from "./notification-header"
import { NotificationSearch } from "./notification-search"
import { NotificationFilter } from "./notification-filter"
import { NotificationTabs } from "./notification-tabs"
import { NotificationList } from "./notification-list"
import { Pagination } from "./pagination"

import {Button} from "@/components/ui/button";
import {CheckCircle2} from "lucide-react";
import {markAllAsReadAction} from "@/actions/notification.action";

import {toastAlert} from "@/components/ui/sonner-v2";


interface NotificationClientWrapperProps {
  search: string
  activeTab: string
  typeFilter: string[]
  priorityFilter: string[]
  categoryFilter: string[]
  notifications: any[] // Utiliser any[] car le type exact est complexe
  stats: {
    total: number
    unread: number
    medical: number
    administrative: number
    system: number
    highPriority: number
    actionRequired: number
  }
  totalItems: number
  currentPage: number
  perPage: number
  hasFilters: boolean
}

export function NotificationClientWrapper({
                                            search,
                                            activeTab,
                                            typeFilter,
                                            priorityFilter,
                                            categoryFilter,
                                            notifications,
                                            stats,
                                            totalItems,
                                            currentPage,
                                            perPage,
                                            hasFilters
                                          }: NotificationClientWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fonction pour mettre à jour les paramètres d'URL
  const updateUrlParams = (params: Record<string, string | null>) => {

    const newSearchParams = new URLSearchParams(searchParams.toString())

    // Empêcher les mises à jour si les paramètres sont identiques aux props
    let hasChanges = false;

    // Mettre à jour chaque paramètre
    Object.entries(params).forEach(([key, value]) => {
      const currentValue = searchParams.get(key);

      // Vérifier si la valeur change réellement
      if ((value === null && currentValue !== null) ||
          (value !== null && value !== currentValue)) {
        hasChanges = true;

        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      }
    })

    // Ne naviguer que s'il y a des changements réels
    if (hasChanges) {
      const newUrl = `?${newSearchParams.toString()}`
      router.push(newUrl, { scroll: false })
    }
  }

  // Gérer la recherche
  const handleSearch = (query: string) => {
    // Ne mettre à jour que si la nouvelle valeur est différente
    if (query !== search) {
      updateUrlParams({
        search: query || null,
        page: "1"
      })
    }
  }

  // Gérer les changements de filtre
  const handleTypeFilter = (types: string[]) => {
    const typesString = types.length ? types.join(",") : null;
    const currentTypesString = typeFilter.length ? typeFilter.join(",") : null;

    if (typesString !== currentTypesString) {
      updateUrlParams({
        type: typesString,
        page: "1"
      })
    }
  }

  const handlePriorityFilter = (priorities: string[]) => {
    const prioritiesString = priorities.length ? priorities.join(",") : null;
    const currentPrioritiesString = priorityFilter.length ? priorityFilter.join(",") : null;

    if (prioritiesString !== currentPrioritiesString) {
      updateUrlParams({
        priority: prioritiesString,
        page: "1"
      })
    }
  }

  const handleCategoryFilter = (categories: string[]) => {
    const categoriesString = categories.length ? categories.join(",") : null;
    const currentCategoriesString = categoryFilter.length ? categoryFilter.join(",") : null;

    if (categoriesString !== currentCategoriesString) {
      updateUrlParams({
        category: categoriesString,
        page: "1"
      })
    }
  }

  // Gérer le changement d'onglet
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      const newParams: Record<string, string | null> = {
        tab,
        page: "1",
        type: null,
        priority: null,
        category: null,
        search: null
      };

      // Définir explicitement la catégorie pour les onglets spécifiques
      if (tab === "medical") {
        newParams.category = "MEDICAL";
      } else if (tab === "administrative") {
        newParams.category = "ADMINISTRATIVE";
      } else if (tab === "system") {
        newParams.category = "SYSTEM";
      }
      updateUrlParams(newParams);
    }
  }

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      updateUrlParams({ page: page.toString() })
    }
  }

  // Effacer tous les filtres
  const clearFilters = () => {
    if (hasFilters) {
      updateUrlParams({
        search: null,
        type: null,
        priority: null,
        category: null,
        page: "1"
      })
    }
  }
  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllAsReadAction()

      if (!result.success) {
        throw new Error(result.error || "Erreur lors du marquage de toutes les notifications comme lues")
      }

        toastAlert.success({
            title: "Succès",
            description: "Toutes les notifications ont été marquées comme lues"
        })
    } catch (error) {
      console.error(error)
      toastAlert.error({
        title: "erreur",
        description: "Échec du marquage de toutes les notifications comme lues"

      })
    }
  }
  return (
      <>
        <AnimatedLayout>
          <ParticlesBackground/>

          <NotificationHeader unreadCount={stats.unread}/>
        </AnimatedLayout>
        <div className="mt-4 flex w-full flex-wrap gap-2 sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={stats.unread === 0}
                  className="h-9  text-white bg-gray-800">
            <CheckCircle2 className="mr-1.5 h-4 w-4"/>
            Tout marquer comme lu
          </Button>
        </div>
        {/* Search and filters */}
        <div className="mt-6 space-y-4">
          <NotificationSearch
              searchQuery={search}
              setSearchQuery={handleSearch}
          />

          {/* Ajouter le composant de filtre ici */}
          <NotificationFilter
              typeFilter={typeFilter}
              priorityFilter={priorityFilter}
              categoryFilter={categoryFilter}
              onTypeFilterChange={handleTypeFilter}
              onPriorityFilterChange={handlePriorityFilter}
              onCategoryFilterChange={handleCategoryFilter}
              clearFilters={clearFilters}
              hasFilters={hasFilters}
          />
        </div>

        <NotificationTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            totalCount={stats.total}
            unreadCount={stats.unread}
            medicalCount={stats.medical}
            administrativeCount={stats.administrative}
            systemCount={stats.system}
        >
          <NotificationList
              notifications={notifications}
              clearFilters={clearFilters}
              searchQuery={search}
              hasFilters={hasFilters}
          />


          {/* Pagination */}
          {totalItems > perPage && (
              <div className="mt-8 flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalItems / perPage)}
                    onPageChange={handlePageChange}
                />
              </div>
          )}
        </NotificationTabs>
      </>
  )
}