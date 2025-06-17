import { Suspense } from "react"
import type { Metadata } from "next"
import { DataTable } from "@/features/admin/users/data-table"
import { columns } from "@/features/admin/users/columns"
import { getUsersWithPaginationAction } from "@/actions/user.action"
import { Users } from "lucide-react"
import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout"
import {ParticlesBackground} from "@/components/animations/particles-background"
import LoaderDatatable from "@/components/animations/loader-datatable"

export const metadata: Metadata = {
  title: "Users",
  description: "User management dashboard with advanced data table",
}

interface UsersPageProps {
  searchParams: {
    page?: string
    per_page?: string
    sort?: string
    role?: string[]
    gender?: string[]
    profileCompleted?: string[]
    search?: string
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  return (
      <div className=" py-6 px-4">
        <AnimatedLayout>
          <ParticlesBackground />

          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Gestion des Utilisateurs</h1>
              <p className=" text-background/80 dark:text-foreground/50">Visualisez et gérez tous les utilisateurs du système</p>
            </div>
          </AnimatedHeader>

        </AnimatedLayout>
        <div className="  rounded-lg h-full w-full   mb-6 p-6">
          <Suspense fallback={
            <div className="py-10 text-center text-gray-500"><LoaderDatatable/></div>
          }>
            <UsersTable searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
  )
}

// Interface corrigée pour accepter les searchParams comme dans la version 2
interface UsersTableProps {
  searchParams: {
    page?: string
    per_page?: string
    sort?: string
    role?: string[]
    gender?: string[]
    profileCompleted?: string[]
    search?: string
  }
}

async function UsersTable({ searchParams }: UsersTableProps) {
  // Await des searchParams ici comme dans la version 2
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = Number(params.per_page) || 10
  const sort = params.sort
  const search = params.search

  // Get filter values
  const roleFilter = Array.isArray(params.role) ? params.role : params.role ? [params.role] : []
  const genderFilter = Array.isArray(params.gender) ? params.gender : params.gender ? [params.gender] : []
  const profileCompletedFilter = Array.isArray(params.profileCompleted) ? params.profileCompleted : params.profileCompleted ? [params.profileCompleted] : []

  // Fetch data with pagination, sorting, and filtering
  const data = await getUsersWithPaginationAction({
    page,
    perPage,
    sort,
    search,
    filters: {
      role: roleFilter,
      gender: genderFilter,
      profileCompleted: profileCompletedFilter,
    },
  })

  if (!data.success) {
    return <div>Error: {data.error}</div>
  }

  const { users, totalUsers } = (data as { success: true; data: { users: any[]; totalUsers: number } }).data

  const filterableColumns = [
    {
      id: "role",
      title: "Rôle",
      options: [
        { label: "Administrateur", value: "ADMIN" },
        { label: "Patient", value: "PATIENT" },
        { label: "Médecin", value: "DOCTOR" },
        { label: "Secrétaire", value: "SECRETARY" },
        { label: "Directeur", value: "DIRECTOR" },
      ],
    },
    {
      id: "gender",
      title: "Genre",
      options: [
        { label: "Homme", value: "MALE" },
        { label: "Femme", value: "FEMALE" },
      ],
    },
    {
      id: "profileCompleted",
      title: "État du profil",
      options: [
        { label: "Complet", value: "true" },
        { label: "Incomplet", value: "false" },
      ],
    },
  ]

  const searchableColumns = [
    {
      id: "name",
      title: "nom",
    },
    {
      id: "email",
      title: "email",
    },
  ]

  return (
      <DataTable
          columns={columns}
          data={users}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          totalItems={totalUsers}
          pageCount={Math.ceil(totalUsers / perPage)}
          defaultPageSize={perPage}

          // Supprimé pageNumber={page} car cette prop pourrait causer des conflits
      />
  )
}