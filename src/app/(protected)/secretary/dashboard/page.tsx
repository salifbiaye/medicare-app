import { getAppointmentRequestsWithPaginationAction, getRequestStatsAction } from "@/actions/appointment-request.action"
import { AppointmentRequestsClientWrapper } from "@/features/secretary/appointment-requests/appointment-requests-client-wrapper"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { SecretaryService } from "@/services/secretary.service"
import { headers } from "next/headers"

// Interface pour searchParams
interface AppointmentRequestsSearchParams {
    page?: string
    perPage?: string
    sort?: string
    search?: string
    tab?: string
    status?: string | string[]
    from?: string
    to?: string
}

export default async function AppointmentRequestsPage({
                                                          searchParams,
                                                      }: {
    searchParams: AppointmentRequestsSearchParams
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
            <div className="px-4">
                <AppointmentRequestsWrapper searchParams={searchParams} />
            </div>
        </div>
    )
}

// Composant qui récupère les données
async function AppointmentRequestsWrapper({
                                              searchParams
                                          }: {
    searchParams: AppointmentRequestsSearchParams
}) {

    // Get current user from session


    const params = await searchParams;
    const page = Number(params.page) || 1;
    const perPage = Number(params.perPage) || 20;
    const sort = params.sort || 'creationDate.desc';
    const search = params.search || '';
    const activeTab = params.tab || 'all';


    // Convert potential single values to arrays
    const statusFilter = Array.isArray(params.status)
        ? params.status
        : params.status
            ? [params.status]
            : [];

    // Build filters object
    const filters: Record<string, string[]> = {};

    if (statusFilter.length > 0) {
        filters.status = statusFilter;
    }

    // Parse date range
    const dateRange: { from?: Date; to?: Date } = {};
    if (params.from) {
        dateRange.from = new Date(params.from);
    }
    if (params.to) {
        dateRange.to = new Date(params.to);
    }

    // Tab-specific filters
    if (activeTab === "pending") {
        filters.status = ["PENDING"];
    } else if (activeTab === "accepted") {
        filters.status = ["ACCEPTED"];
    } else if (activeTab === "rejected") {
        filters.status = ["REJECTED"];
    } else if (activeTab === "transferred") {
        filters.status = ["TRANSFERRED"];
    }

    // Récupérer les demandes et les statistiques
    const [requestsResult, statsResult,data] = await Promise.all([
        getAppointmentRequestsWithPaginationAction({
            page,
            perPage,
            sort,
            search,
            filters,
        }),
        getRequestStatsAction(),
        SecretaryService.findSecreatry()
    ]);

    // Valeurs par défaut pour les statistiques
    const defaultStats = {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        transferred: 0,
        completed: 0
    };

    // Extraire les données avec vérification de type
    const requests = requestsResult.success && requestsResult.data
        ? requestsResult.data
        : [];

    const totalItems = requestsResult.success && requestsResult.data?.meta.total
        ? requestsResult.data.meta.total
        : 0;

    const stats = statsResult.success && statsResult.data
        ? statsResult.data
        : defaultStats;

    // Vérifier si des filtres sont appliqués
    const hasFilters = statusFilter.length > 0 || !!search || !!dateRange.from || !!dateRange.to;

    return (
        <AppointmentRequestsClientWrapper
            requests={requests}
            stats={stats}
            totalItems={totalItems}
            currentPage={page}
            perPage={perPage}
            activeTab={activeTab}
            search={search}
            statusFilter={statusFilter}
            dateRange={dateRange}
            hasFilters={hasFilters}
            hospitalInfo={data.data?.hospital}
            serviceInfo={data.data?.service}
        />
    )
}