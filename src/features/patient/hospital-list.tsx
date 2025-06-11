"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getHospitalsWithPaginationAction } from "@/actions/hospital.action"
import { Hospital } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/features/notifications/components/pagination"
import { MapPin, Building, Search, ArrowRight, Loader2 } from "lucide-react"

interface HospitalListProps {
  initialHospitals?: Hospital[]
}

export function HospitalList({ initialHospitals }: HospitalListProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals || [])
  const [loading, setLoading] = useState<boolean>(!initialHospitals)
  const [search, setSearch] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalHospitals, setTotalHospitals] = useState<number>(0)
  const perPage = 8 // Nombre d'hôpitaux par page
  const router = useRouter()

  useEffect(() => {
    fetchHospitals()
  }, [currentPage, search])

  const fetchHospitals = async () => {
    setLoading(true)
    try {
      const response = await getHospitalsWithPaginationAction({
        page: currentPage,
        perPage,
        search: search || undefined,
        sort: "name.asc",
      })

      if (response.success && response.data) {
        setHospitals(response.data.hospitals)
        setTotalHospitals(response.data.totalHospitals)
        setTotalPages(Math.ceil(response.data.totalHospitals / perPage))
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des hôpitaux:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleHospitalClick = (hospitalId: string) => {
    router.push(`/patient/requests/${hospitalId}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1) // Réinitialiser à la première page lors d'une nouvelle recherche
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Hôpitaux</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un hôpital..."
            className="w-full pl-8"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : hospitals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Building className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Aucun hôpital trouvé</h3>
          <p className="text-muted-foreground">
            {search ? "Essayez d'autres critères de recherche" : "Aucun hôpital n'est disponible actuellement"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1">{hospital.name}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{hospital.address}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
            
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleHospitalClick(hospital.id)}
                  >
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  )
} 