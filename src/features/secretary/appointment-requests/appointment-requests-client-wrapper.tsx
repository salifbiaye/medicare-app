"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { RequestStatus } from "@prisma/client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import { AppointmentRequestsList } from "./appointment-requests-list"
import {
  updateAppointmentRequestsStatusAction,
  updateAppointmentRequestStatusAction
} from "@/actions/appointment-request.action"
import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";
import {Clock, Users, CheckCircle2, XCircle, ArrowRightLeft, Building, Stethoscope} from "lucide-react";

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
  hospitalInfo?: {
    id: string
    name: string
    address: string
    phone: string
    email?: string | null
  } | null
  serviceInfo?: {
    id: string
    name?: string | null
    type: string
    description?: string | null
  } | null
}

export function AppointmentRequestsClientWrapper({
                                                   requests,
                                                   stats,
                                                   totalItems,
                                                   currentPage,
                                                   perPage,
                                                   activeTab,
                                                   hospitalInfo,
                                                   serviceInfo
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
  const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
    setIsSubmitting(true)

    try {
      await updateAppointmentRequestsStatusAction(requestId, newStatus)
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

        {hospitalInfo && serviceInfo && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 shadow-md border border-blue-200 dark:border-blue-800 mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-800/20 rounded-full -mt-20 -mr-20 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-200 dark:bg-indigo-800/20 rounded-full -mb-10 -ml-10 opacity-20"></div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {hospitalInfo.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">{hospitalInfo.address}</p>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-900/50 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                <Stethoscope className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Service: {serviceInfo.name || serviceInfo.type}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 rounded-2xl blur-xl opacity-50"></div>

          <div className="relative grid gap-4 md:grid-cols-5">
            <StatsCard 
              title="Toutes les demandes" 
              value={stats.total} 
              description="Total des demandes"
              icon={Users}
              color="accent"
              bgClass="bg-purple-100 dark:bg-purple-900/20"
              iconClass="bg-purple-500 text-white"
              textClass="text-purple-700 dark:text-purple-300"
              borderClass="border-purple-300 dark:border-purple-700"
            />
            <StatsCard 
              title="En attente" 
              value={stats.pending} 
              description="Demandes non traitées" 
              icon={Clock}
              color="warning"
              bgClass="bg-amber-100 dark:bg-amber-900/20"
              iconClass="bg-amber-500 text-white"
              textClass="text-amber-700 dark:text-amber-300"
              borderClass="border-amber-300 dark:border-amber-700"
            />
            <StatsCard 
              title="Acceptées" 
              value={stats.accepted} 
              description="Demandes acceptées" 
              icon={CheckCircle2}
              color="success"
              bgClass="bg-green-100 dark:bg-green-900/20"
              iconClass="bg-green-500 text-white"
              textClass="text-green-700 dark:text-green-300"
              borderClass="border-green-300 dark:border-green-700"
            />
            <StatsCard 
              title="Rejetées" 
              value={stats.rejected} 
              description="Demandes rejetées" 
              icon={XCircle}
              color="destructive"
              bgClass="bg-red-100 dark:bg-red-900/20"
              iconClass="bg-red-500 text-white"
              textClass="text-red-700 dark:text-red-300"
              borderClass="border-red-300 dark:border-red-700"
            />
            <StatsCard 
              title="Transférées" 
              value={stats.transferred} 
              description="Demandes transférées" 
              icon={ArrowRightLeft}
              color="secondary"
              bgClass="bg-purple-100 dark:bg-purple-900/20"
              iconClass="bg-purple-500 text-white"
              textClass="text-purple-700 dark:text-purple-300"
              borderClass="border-purple-300 dark:border-purple-700"
            />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
            <TabsTrigger value="accepted">Acceptées ({stats.accepted})</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées ({stats.rejected})</TabsTrigger>
            <TabsTrigger value="transferred">Transférées ({stats.transferred})</TabsTrigger>
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
  icon: Icon,
  color,
  bgClass,
  iconClass,
  textClass,
  borderClass,
}: {
  title: string
  value: number
  description: string
  icon: React.ElementType
  color: string
  bgClass: string
  iconClass: string
  textClass: string
  borderClass: string
}) {
  return (
    <div className={`relative overflow-hidden ${bgClass} rounded-xl backdrop-blur-sm border ${borderClass} shadow-lg hover:shadow-xl transition-all duration-300`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white dark:bg-gray-700"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white dark:bg-gray-700"></div>
      </div>

      <div className="relative h-full p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className={`${iconClass} p-2 rounded-lg shadow-md`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-auto">
          <p className={`text-3xl font-bold ${textClass}`}>{value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${iconClass}`}></div>
      </div>
    </div>
  )
}