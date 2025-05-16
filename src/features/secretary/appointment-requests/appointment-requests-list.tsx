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
  Eye,
  CheckCheck,
  AlertCircle,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AppointmentRequest = {
  id: string
  description: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "TRANSFERRED" | "COMPLETED"
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
  onStatusUpdate: (requestId: string, newStatus: string) => void
}

export function AppointmentRequestsList({ requests, onStatusUpdate }: AppointmentRequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"accept" | "reject" | "transfer" | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedService, setSelectedService] = useState("")

  const handleViewRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  const handleActionRequest = (request: AppointmentRequest, action: "accept" | "reject" | "transfer") => {
    setSelectedRequest(request)
    setActionType(action)
    setActionDialogOpen(true)
  }

  const handleConfirmAction = () => {
    if (!selectedRequest || !actionType) return

    let newStatus = ""
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
    }

    onStatusUpdate(selectedRequest.id, newStatus)
    setActionDialogOpen(false)
    setActionNote("")
    setSelectedDoctor("")
    setSelectedService("")
    setActionType(null)
  }

  const getStatusBadge = (status: string) => {
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
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 flex items-center gap-1">
            <CheckCheck className="h-3 w-3" />
            <span>Complétée</span>
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

  // Mock data for doctors and services
  const mockDoctors = [
    { id: "1", name: "Dr. Martin Dupont", specialty: "Cardiologie" },
    { id: "2", name: "Dr. Sophie Laurent", specialty: "Pédiatrie" },
    { id: "3", name: "Dr. Thomas Bernard", specialty: "Neurologie" },
    { id: "4", name: "Dr. Julie Moreau", specialty: "Dermatologie" },
  ]

  const mockServices = [
    { id: "1", name: "Cardiologie", type: "CARDIOLOGY" },
    { id: "2", name: "Pédiatrie", type: "PEDIATRICS" },
    { id: "3", name: "Neurologie", type: "NEUROLOGY" },
    { id: "4", name: "Dermatologie", type: "DERMATOLOGY" },
  ]

  return (
    <>
      <div className="grid gap-4">
        {requests.map((request) => (
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
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewRequest(request)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </Button>

                  {request.status === "PENDING" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <MoreHorizontal className="mr-2 h-4 w-4" />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleActionRequest(request, "accept")}>
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          <span>Accepter</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionRequest(request, "reject")}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Rejeter</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionRequest(request, "transfer")}>
                          <ArrowRightLeft className="mr-2 h-4 w-4 text-purple-500" />
                          <span>Transférer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande de rendez-vous</DialogTitle>
            <DialogDescription>Informations complètes sur la demande de rendez-vous</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Informations générales</h3>
                  {getStatusBadge(selectedRequest.status)}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">ID de la demande</Label>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Date de création</Label>
                    <p className="font-medium">
                      {format(new Date(selectedRequest.creationDate), "PPP 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Dernière modification</Label>
                    <p className="font-medium">
                      {format(new Date(selectedRequest.modificationDate), "PPP 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Dossier médical existant</Label>
                    <p className="font-medium">{selectedRequest.existingRecord ? "Oui" : "Non"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <div className="rounded-md border p-4">
                    <p>{selectedRequest.description}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Hôpital</Label>
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedRequest.hospital.name}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Service</Label>
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Stethoscope className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {selectedRequest.service
                          ? selectedRequest.service.name
                          : getServiceLabel(selectedRequest.identifiedService)}
                      </span>
                    </div>
                  </div>
                </div>

                {(selectedRequest.secretary || selectedRequest.doctor) && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedRequest.secretary && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Secrétaire assigné(e)</Label>
                        <div className="flex items-center gap-2 rounded-md border p-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span>{selectedRequest.secretary.user.name}</span>
                        </div>
                      </div>
                    )}

                    {selectedRequest.doctor && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Médecin assigné</Label>
                        <div className="flex items-center gap-2 rounded-md border p-3">
                          <Stethoscope className="h-5 w-5 text-muted-foreground" />
                          <span>{selectedRequest.doctor.user.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="patient" className="space-y-6 pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={selectedRequest.patient.image || ""} alt={selectedRequest.patient.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {selectedRequest.patient.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{selectedRequest.patient.name}</h3>
                    <p className="text-muted-foreground">{selectedRequest.patient.email}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">ID du patient</Label>
                    <p className="font-medium">{selectedRequest.patient.id}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Dossier médical existant</Label>
                    <p className="font-medium">{selectedRequest.existingRecord ? "Oui" : "Non"}</p>
                  </div>
                </div>

                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <h4 className="font-medium">Informations supplémentaires</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pour voir l'historique complet du patient et ses informations détaillées, veuillez consulter son
                    dossier médical.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Voir le dossier médical
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6 pt-4">
                <h3 className="text-lg font-medium">Historique des actions</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Calendar className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Demande créée</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedRequest.creationDate), "PPP 'à' HH:mm", { locale: fr })}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">La demande a été créée par le patient</p>
                    </div>
                  </div>

                  {selectedRequest.status !== "PENDING" && (
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          selectedRequest.status === "ACCEPTED"
                            ? "bg-green-100"
                            : selectedRequest.status === "REJECTED"
                              ? "bg-red-100"
                              : selectedRequest.status === "TRANSFERRED"
                                ? "bg-purple-100"
                                : "bg-teal-100"
                        }`}
                      >
                        {selectedRequest.status === "ACCEPTED" && <CheckCircle2 className="h-4 w-4 text-green-700" />}
                        {selectedRequest.status === "REJECTED" && <XCircle className="h-4 w-4 text-red-700" />}
                        {selectedRequest.status === "TRANSFERRED" && (
                          <ArrowRightLeft className="h-4 w-4 text-purple-700" />
                        )}
                        {selectedRequest.status === "COMPLETED" && <CheckCheck className="h-4 w-4 text-teal-700" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            Demande{" "}
                            {selectedRequest.status === "ACCEPTED"
                              ? "acceptée"
                              : selectedRequest.status === "REJECTED"
                                ? "rejetée"
                                : selectedRequest.status === "TRANSFERRED"
                                  ? "transférée"
                                  : "complétée"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(selectedRequest.modificationDate), "PPP 'à' HH:mm", { locale: fr })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedRequest.status === "ACCEPTED" && "La demande a été acceptée par un secrétaire"}
                          {selectedRequest.status === "REJECTED" && "La demande a été rejetée par un secrétaire"}
                          {selectedRequest.status === "TRANSFERRED" && "La demande a été transférée à un autre service"}
                          {selectedRequest.status === "COMPLETED" && "Le rendez-vous a été complété"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" && "Accepter la demande"}
              {actionType === "reject" && "Rejeter la demande"}
              {actionType === "transfer" && "Transférer la demande"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept" && "Acceptez cette demande et assignez un médecin"}
              {actionType === "reject" && "Rejetez cette demande et fournissez une raison"}
              {actionType === "transfer" && "Transférez cette demande à un autre service"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {actionType === "accept" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Médecin</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un médecin" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (optionnel)</Label>
                  <Textarea
                    id="note"
                    placeholder="Ajoutez une note pour le médecin..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                  />
                </div>
              </div>
            )}

            {actionType === "reject" && (
              <div className="space-y-2">
                <Label htmlFor="reason">Raison du rejet</Label>
                <Textarea
                  id="reason"
                  placeholder="Veuillez fournir une raison pour le rejet..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  required
                />
              </div>
            )}

            {actionType === "transfer" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Raison du transfert</Label>
                  <Textarea
                    id="note"
                    placeholder="Veuillez fournir une raison pour le transfert..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleConfirmAction}
                disabled={
                  (actionType === "accept" && !selectedDoctor) ||
                  (actionType === "reject" && !actionNote) ||
                  (actionType === "transfer" && (!selectedService || !actionNote))
                }
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
