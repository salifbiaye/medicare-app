import { getNotificationsWithPaginationAction, getNotificationStatsAction } from "@/actions/notification.action"
import type { Notification } from "@prisma/client"
import {NotificationClientWrapper} from "@/features/notifications/components/notification-client-wrapper";

// Type pour les notifications avec sender
type NotificationWithSender = Notification & {
  sender?: {
    id: string
    name: string
    image?: string | null
  } | null
}

// Type pour les statistiques de notifications
interface NotificationStats {
  total: number
  unread: number
  medical: number
  administrative: number
  system: number
  highPriority: number
  actionRequired: number
}

// Interface pour searchParams
interface NotificationsSearchParams {
  page?: string
  perPage?: string
  sort?: string
  search?: string
  tab?: string
  type?: string | string[]
  priority?: string | string[]
  category?: string | string[]
}

export default async function NotificationsPage({
                                                  searchParams,
                                                }: {
  searchParams: NotificationsSearchParams
}) {
  return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
        <div className="px-4">
            <NotificationsWrapper searchParams={searchParams} />
        </div>
      </div>
  )
}

// Composant qui récupère les données
async function NotificationsWrapper({
                                      searchParams
                                    }: {
  searchParams: NotificationsSearchParams
}) {
  const params = await searchParams ;
  const page = Number(params.page) || 1;
  const perPage = Number(params.perPage) || 20;
  const sort = params.sort || 'createdAt.desc';
  const search = params.search || '';
  const activeTab = params.tab || 'all';

  // Convert potential single values to arrays
  const typeFilter = Array.isArray(params.type)
      ? params.type
      : params.type
          ? [params.type]
          : [];

  const priorityFilter = Array.isArray(params.priority)
      ? params.priority
      : params.priority
          ? [params.priority]
          : [];

  const categoryFilter = Array.isArray(params.category)
      ? params.category
      : params.category
          ? [params.category]
          : [];

  // Build filters object
  const filters: Record<string, string[]> = {};

  if (priorityFilter.length > 0) {
    filters.priority = priorityFilter;
  }

  if (categoryFilter.length > 0) {
    filters.category = categoryFilter;
  }

  if (typeFilter.length > 0) {
    filters.type = typeFilter;
  }
  console.log("Active tab:", activeTab);
  console.log("Original category filter:", params.category);
  // Tab-specific filters
  if (activeTab === "unread") {
    filters.read = ["false"];
  } else if (activeTab === "medical") {
    filters.category = ["MEDICAL"];
  } else if (activeTab === "administrative") {
    filters.category = ["ADMINISTRATIVE"];
  } else if (activeTab === "system") {
    filters.category = ["SYSTEM"];
  }

  // Récupérer les notifications et les statistiques
  const [notificationsResult, statsResult] = await Promise.all([
    getNotificationsWithPaginationAction({
      page,
      perPage,
      sort,
      search,
      filters,
    }),
    getNotificationStatsAction(),
  ])

  // Valeurs par défaut pour les statistiques
  const defaultStats: NotificationStats = {
    total: 0,
    unread: 0,
    medical: 0,
    administrative: 0,
    system: 0,
    highPriority: 0,
    actionRequired: 0,
  }

  // Extraire les données avec vérification de type
  const notifications: NotificationWithSender[] =
      notificationsResult.success && notificationsResult.data?.notifications
          ? (notificationsResult.data.notifications as NotificationWithSender[])
          : []

  const totalItems: number =
      notificationsResult.success && notificationsResult.data?.total ? notificationsResult.data.total : 0

  const stats: NotificationStats =
      statsResult.success && statsResult.data ? (statsResult.data as NotificationStats) : defaultStats

  // Vérifier si des filtres sont appliqués
  const hasFilters = priorityFilter.length > 0 || categoryFilter.length > 0 || typeFilter.length > 0 || !!search

  return (
      <NotificationClientWrapper
          search={search}
          activeTab={activeTab}
          typeFilter={typeFilter}
          priorityFilter={priorityFilter}
          categoryFilter={categoryFilter}
          notifications={notifications}
          stats={stats}
          totalItems={totalItems}
          currentPage={page}
          perPage={perPage}
          hasFilters={hasFilters}
      />
  )
}