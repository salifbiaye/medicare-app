"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, User, ArrowUpRight, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getPrescriptionsByMedicalRecordIdAction } from "@/actions/patient.action"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toastAlert } from "@/components/ui/sonner-v2"

interface Prescription {
  id: string
  content: string
  startDate: Date
  endDate: Date | null
  status: string
  createdAt: Date
  doctor: {
    user: {
      name: string
    }
  }
}

export function PrescriptionsList({ medicalRecordId, patientId }: { medicalRecordId: string, patientId: string }) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setIsLoading(true)
        const response = await getPrescriptionsByMedicalRecordIdAction(medicalRecordId)
        if (response.success) {
          setPrescriptions(response.data)
        } else {
          toastAlert.error({
            title: "Erreur",
            description: "Impossible de récupérer les prescriptions",
          })
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des prescriptions:", error)
        toastAlert.error({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la récupération des prescriptions",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrescriptions()
  }, [medicalRecordId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>
      default:
        return <Badge variant="outline">Inconnue</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loader"></div>
      </div>
    )
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Aucune prescription</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Ce patient n'a pas encore de prescriptions enregistrées.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Prescriptions ({prescriptions.length})</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-muted/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-base">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    Prescription du {format(new Date(prescription.createdAt), "d MMMM yyyy", { locale: fr })}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    <div className="flex items-center text-xs">
                      <Calendar className="mr-1 h-3.5 w-3.5" />
                      Du {format(new Date(prescription.startDate), "d MMMM yyyy", { locale: fr })}{" "}
                      {prescription.endDate && (
                        <>au {format(new Date(prescription.endDate), "d MMMM yyyy", { locale: fr })}</>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <User className="mr-1 h-3.5 w-3.5" />
                      Dr. {prescription.doctor.user.name}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(prescription.status)}
                  <Link href={`/doctor/prescriptions/${prescription.id}`} passHref>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mt-2">
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">{prescription.content}</p>
              </div>
              {prescription.status === "ACTIVE" && !prescription.endDate && (
                <div className="mt-3 flex items-center text-xs text-amber-600">
                  <AlertCircle className="mr-1 h-3.5 w-3.5" />
                  Prescription sans date de fin définie
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 