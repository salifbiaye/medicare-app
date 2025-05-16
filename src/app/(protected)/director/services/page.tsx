import { Metadata } from "next"
import { columns } from "@/features/director/services/columns"
import { DataTable } from "@/features/director/services/data-table"
import { getServicesWithPaginationAction } from "@/actions/service.action"
import { Stethoscope } from "lucide-react"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

export const metadata: Metadata = {
  title: "Services",
  description: "Gérez les services médicaux de vos hôpitaux",
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string  | string[] | undefined }
}) {
  const searchParam = await searchParams
  const page = Number(searchParam.page) || 1
  const perPage = Number(searchParam.per_page) || 10
  const sort = (searchParam.sort as string) || "createdAt.desc"
  const search = searchParam.search as string
  const filters = searchParam

  // Fetch services data with pagination
  const {
    data: { services, totalServices } = { services: [], totalServices: 0 },
  } = await getServicesWithPaginationAction({
    page,
    perPage,
    sort,
    search,
    filters,
  })

  // Filter columns for search
  const searchableColumns = [
    {
      id: "name",
      title: "Nom du service",
    },
    {
      id: "description",
      title: "Description",
    },
  ]

  // Filter columns for dropdown
  const filterableColumns = [
    {
      id: "type",
      title: "Type de service",
      options: [
        { label: "Médecine générale", value: "GENERAL_PRACTICE" },
        { label: "Ophtalmologie", value: "OPHTHALMOLOGY" },
        { label: "Cardiologie", value: "CARDIOLOGY" },
        { label: "Pédiatrie", value: "PEDIATRICS" },
        { label: "Dermatologie", value: "DERMATOLOGY" },
        { label: "Neurologie", value: "NEUROLOGY" },
        { label: "Orthopédie", value: "ORTHOPEDICS" },
        { label: "Gynécologie", value: "GYNECOLOGY" },
        { label: "Radiologie", value: "RADIOLOGY" },
        { label: "Psychiatrie", value: "PSYCHIATRY" },
        { label: "Urologie", value: "UROLOGY" },
        { label: "ORL", value: "ENT" },
      ],
    },
  ]

  return (
    <div className="py-10">
      <AnimatedLayout>
        <ParticlesBackground />
        <AnimatedHeader>
          <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-background dark:text-foreground font-bold">Services</h1>
            <p className="text-background/50 dark:text-muted-foreground mt-1">
              Gérez les services médicaux de vos établissements
            </p>
          </div>
        </AnimatedHeader>
      </AnimatedLayout>
      
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={services}
          searchableColumns={searchableColumns}
          filterableColumns={filterableColumns}
          totalItems={totalServices}
          pageCount={Math.ceil(totalServices / perPage)}
          defaultPageSize={perPage}
        />
      </div>
    </div>
  )
} 