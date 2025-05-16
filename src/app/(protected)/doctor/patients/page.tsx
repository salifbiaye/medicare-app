import { Suspense } from "react"
import type { Metadata } from "next"
import { DataTable } from "@/features/doctor/patients/data-table"
import { columns } from "@/features/doctor/patients/columns"
import { getPatientsWithPaginationAction } from "@/actions/patient.action"
import { Users } from "lucide-react"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import LoaderDatatable from "@/components/animations/loader-datatable"

export const metadata: Metadata = {
  title: "Patients",
  description: "Gestion des dossiers médicaux des patients",
}

interface PatientsPageProps {
  searchParams: {
    page?: string
    per_page?: string
    sort?: string
    name?: string[]
    email?: string[]
    search?: string
  }
}

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  return (
    <div className="py-6 px-4">
      <AnimatedLayout>
        <ParticlesBackground />

        <AnimatedHeader>
          <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Gestion des Patients</h1>
            <p className="text-background/80 dark:text-foreground/50">Visualisez et gérez tous les dossiers médicaux de vos patients</p>
          </div>
        </AnimatedHeader>
      </AnimatedLayout>

      <div className="rounded-lg h-full w-full mb-6 p-6">
        <Suspense fallback={
          <div className="py-10 text-center text-gray-500"><LoaderDatatable /></div>
        }>
          <PatientsTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

async function PatientsTable({ searchParams }: PatientsPageProps) {
  // Parse search params
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = Number(params.per_page) || 10
  const sort = params.sort
  const search = params.search

  // Get filter values
  const nameFilter = Array.isArray(params.name) ? params.name : params.name ? [params.name] : []
  const emailFilter = Array.isArray(params.email) ? params.email : params.email ? [params.email] : []

  // Fetch data with pagination, sorting, and filtering
  const data = await getPatientsWithPaginationAction({
    page,
    perPage,
    sort,
    search,
    filters: {
      name: nameFilter,
      email: emailFilter,
    },
  })

  if (!data.success) {
    return <div>Error: {data.error}</div>
  }

  const { patients, totalPatients } = data.data

  const searchableColumns = [
    {
      id: "name",
      title: "nom",
    },
    {
      id: "email",
      title: "email",
    },
    {
      id: "socialSecurityNumber",
      title: "numéro de sécurité sociale",
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={patients}
      searchableColumns={searchableColumns}
      totalItems={totalPatients}
      pageCount={Math.ceil(totalPatients / perPage)}
      defaultPageSize={perPage}
    />
  )
}