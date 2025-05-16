"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Calendar,
  Clock,
  FileText,
  User,
  Building,
  Stethoscope,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  MoreHorizontal,
  Eye
} from "lucide-react"
import { RequestStatus } from "@prisma/client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type AppointmentRequest = {
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

type AppointmentRequestsListProps = {
  requests: AppointmentRequest[]
  onStatusUpdate: (requestId: string, newStatus: RequestStatus, data?: {
    doctorId?: string
    note?: string
    serviceId?: string
  }) => void
  isSubmitting?: boolean
}

export function AppointmentRequestsList({ requests, onStatusUpdate, isSubmitting = false }: AppointmentRequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [actionType, setActionType] = useState<"accept" | "reject" | "transfer" | null>(null)

  const handleAction = (request: AppointmentRequest, action: "accept" | "reject" | "transfer") => {
    setSelectedRequest(request)
    setActionType(action)
    setAlertOpen(true)
  }

  const handleConfirmAction = () => {
    if (!selectedRequest || !actionType) return

    let newStatus: RequestStatus;
    
    switch (actionType) {
      case "accept":
        newStatus = "ACCEPTED"
        break
      case "reject":
        newStatus = "REJECTED"
        break
      case "transfer":
        newStatus = "TRANSFERRED"
        break
      default:
        return;
    }

    onStatusUpdate(selectedRequest.id, newStatus)
    setAlertOpen(false)
    setSelectedRequest(null)
    setActionType(null)
  }

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>En attente</span>
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Acceptée</span>
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejetée</span>
          </Badge>
        )
      case "TRANSFERRED":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3" />
            <span>Transférée</span>
          </Badge>
        )
      default:
        return null
    }
  }

  const getServiceLabel = (serviceType: string | null) => {
    if (!serviceType) return "Non spécifié"

    const serviceMap: Record<string, string> = {
      GENERAL_PRACTICE: "Médecine générale",
      OPHTHALMOLOGY: "Ophtalmologie",
      CARDIOLOGY: "Cardiologie",
      PEDIATRICS: "Pédiatrie",
      DERMATOLOGY: "Dermatologie",
      NEUROLOGY: "Neurologie",
      ORTHOPEDICS: "Orthopédie",
      GYNECOLOGY: "Gynécologie",
      RADIOLOGY: "Radiologie",
      PSYCHIATRY: "Psychiatrie",
      UROLOGY: "Urologie",
      ENT: "ORL",
    }

    return serviceMap[serviceType] || serviceType
  }

  return (
    <>
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            Aucune demande de rendez-vous trouvée.
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={request.patient.image || ""} alt={request.patient.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {request.patient.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{request.patient.name}</h3>
                          <p className="text-sm text-muted-foreground">{request.patient.email}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">{getStatusBadge(request.status)}</div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date de création</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(request.creationDate), "PPP", { locale: fr })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Building className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Hôpital</p>
                          <p className="text-sm text-muted-foreground">{request.hospital.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Stethoscope className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Service</p>
                          <p className="text-sm text-muted-foreground">
                            {request.service ? request.service.name : getServiceLabel(request.identifiedService)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-end gap-2 border-t bg-muted/50 p-4 md:flex-col md:border-l md:border-t-0">
                    {request.status === "PENDING" && (
                      <>
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="w-full bg-green-50 dark:bg-background/30 text-green-700 dark:text-white border-green-200 hover:bg-green-100 hover:text-green-800"
                          onClick={() => handleAction(request, "accept")}
                          disabled={isSubmitting}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Accepter
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="w-full bg-red-50 text-red-700 border-red-200  dark:bg-background/30  dark:text-white hover:bg-red-100 hover:text-red-800"
                          onClick={() => handleAction(request, "reject")}
                          disabled={isSubmitting}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>

                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "accept" && "Accepter la demande"}
              {actionType === "reject" && "Rejeter la demande"}
              {actionType === "transfer" && "Transférer la demande"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "accept" && "Êtes-vous sûr de vouloir accepter cette demande ?"}
              {actionType === "reject" && "Êtes-vous sûr de vouloir rejeter cette demande ?"}
              {actionType === "transfer" && "Êtes-vous sûr de vouloir transférer cette demande ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              disabled={isSubmitting}
              className={
                actionType === "accept" 
                ? "bg-green-600 hover:bg-green-700" 
                : actionType === "reject" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-purple-600 hover:bg-purple-700"
              }
            >
              {isSubmitting ? "En cours..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
