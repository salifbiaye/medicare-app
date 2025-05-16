"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { RequestStatus } from "@prisma/client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AppointmentRequestsList } from "./appointment-requests-list"
import { AppointmentRequestsFilters } from "./appointment-requests-filters"
import { updateAppointmentRequestStatusAction } from "@/actions/appointment-request.action"
import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";
import {Clock, Users} from "lucide-react";

// Interfaces pour les données
export type AppointmentRequestWithRelations = {
  id: string
  description: string
  status: RequestStatus
  existingRecord: boolean
  identifiedService: string | null
  creationDate: string
  modificationDate: string
  patient: {
    id: string
    name: string
    email: string
    image?: string
  }
  hospital: {
    id: string
    name: string
  }
  service?: {
    id: string
    name: string
    type: string
  }
  secretary?: {
    id: string
    user: {
      name: string
    }
  }
  doctor?: {
    id: string
    user: {
      name: string
    }
  }
}

interface AppointmentRequestsStats {
  total: number
  pending: number
  accepted: number
  rejected: number
  transferred: number
  completed: number
}

interface AppointmentRequestsClientWrapperProps {
  // Update this to reflect the actual structure of your data
  requests: AppointmentRequestWithRelations[] | {
    data: AppointmentRequestWithRelations[]
    meta: { total: number, [key: string]: any }
  }
  stats: AppointmentRequestsStats
  totalItems: number
  currentPage: number
  perPage: number
  activeTab: string
  search: string
  statusFilter: string[]
  dateRange: {
    from?: Date
    to?: Date
  }
  hasFilters: boolean
}

export function AppointmentRequestsClientWrapper({
                                                   requests,
                                                   stats,
                                                   totalItems,
                                                   currentPage,
                                                   perPage,
                                                   activeTab,
                                                 }: AppointmentRequestsClientWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Extract the actual request data array from the response
  // This handles both array and object with data property formats
  const requestsArray: AppointmentRequestWithRelations[] = Array.isArray(requests)
      ? requests
      : (requests.data || [])

  // Fonction pour mettre à jour les filtres dans l'URL
  const updateFilters = (filters: any) => {
    const params = new URLSearchParams();

    // Paramètres de pagination
    params.set('page', currentPage.toString());
    params.set('perPage', perPage.toString());

    // Paramètre d'onglet actif
    if (filters.tab && filters.tab !== 'all') {
      params.set('tab', filters.tab);
    }

    // Paramètre de recherche
    if (filters.search) {
      params.set('search', filters.search);
    }

    // Paramètre de filtre par statut
    if (filters.status && filters.status.length > 0 && filters.status !== 'ALL') {
      filters.status.forEach((status: string) => {
        params.append('status', status);
      });
    }

    // Paramètre de filtre par date
    if (filters.dateRange?.from) {
      params.set('from', filters.dateRange.from.toISOString());
    }

    if (filters.dateRange?.to) {
      params.set('to', filters.dateRange.to.toISOString());
    }

    // Rediriger vers la nouvelle URL
    router.push(`${pathname}?${params.toString()}`);
  }

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  // Fonction pour changer d'onglet
  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(window.location.search);

    if (tab === 'all') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }

    params.set('page', '1'); // Retour à la première page
    router.push(`${pathname}?${params.toString()}`);
  }

  // Fonction pour mettre à jour le statut d'une demande
  const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus, data?: {
    doctorId?: string
    note?: string
    serviceId?: string
  }) => {
    setIsSubmitting(true)

    try {
      await updateAppointmentRequestStatusAction(requestId, newStatus, data)
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="space-y-6">

        <AnimatedLayout>
          <ParticlesBackground />

          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <Clock className="h-8 w-8 text-primary"/>
            </div>
            <div>
              <h2 className="text-2xl text-muted dark:text-muted-foreground font-bold tracking-tight">Demandes de rendez-vous</h2>
              <p className="text-gray-300  dark:text-muted-foreground">
                Gérez les demandes de rendez-vous des patients pour votre service
              </p>
            </div>
          </AnimatedHeader>

        </AnimatedLayout>

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Toutes les demandes" value={stats.total} description="Total des demandes"/>
          <StatsCard title="En attente" value={stats.pending} description="Demandes non traitées" className="border-amber-200 dark:border-amber-800" />
          <StatsCard title="Acceptées" value={stats.accepted} description="Demandes acceptées" className="border-green-200 dark:border-green-800" />
          <StatsCard title="Rejetées" value={stats.rejected} description="Demandes rejetées" className="border-red-200 dark:border-red-800" />
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
            <TabsTrigger value="accepted">Acceptées ({stats.accepted})</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-4">
            <AppointmentRequestsList
                requests={requestsArray}
                onStatusUpdate={handleStatusUpdate}
                isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="pending" className="pt-4">
            <AppointmentRequestsList
                requests={requestsArray.filter(r => r.status === "PENDING")}
                onStatusUpdate={handleStatusUpdate}
                isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="accepted" className="pt-4">
            <AppointmentRequestsList
                requests={requestsArray.filter(r => r.status === "ACCEPTED")}
                onStatusUpdate={handleStatusUpdate}
                isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="rejected" className="pt-4">
            <AppointmentRequestsList
                requests={requestsArray.filter(r => r.status === "REJECTED")}
                onStatusUpdate={handleStatusUpdate}
                isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="transferred" className="pt-4">
            <AppointmentRequestsList
                requests={requestsArray.filter(r => r.status === "TRANSFERRED")}
                onStatusUpdate={handleStatusUpdate}
                isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>

        {totalItems > perPage && (
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalItems / perPage)}
                onPageChange={handlePageChange}
            />
        )}
      </div>
  )
}

function StatsCard({
                     title,
                     value,
                     description,
                     className = "",
                   }: {
  title: string
  value: number
  description: string
  className?: string
}) {
  return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
  )
}