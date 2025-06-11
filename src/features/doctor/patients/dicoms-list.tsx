"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Image, Calendar, Eye, ArrowUpRight, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getDicomImagesByMedicalRecordIdAction } from "@/actions/patient.action"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toastAlert } from "@/components/ui/sonner-v2"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { shareDicomAction } from "@/actions/dicom.action"

interface DicomImage {
  id: string
  orthanc_id: string
  type: string
  description: string | null
  uploadDate: Date
}

export function DicomsList({ medicalRecordId }: { medicalRecordId: string }) {
  const [dicomImages, setDicomImages] = useState<DicomImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDicom, setSelectedDicom] = useState<DicomImage | null>(null)
  const [doctorEmail, setDoctorEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDicomImages = async () => {
      try {
        setIsLoading(true)
        const response = await getDicomImagesByMedicalRecordIdAction(medicalRecordId)
        if (response.success) {
          setDicomImages(response.data)
        } else {
          toastAlert.error({
            title: "Erreur",
            description: "Impossible de récupérer les images DICOM",
          })
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des images DICOM:", error)
        toastAlert.error({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la récupération des images DICOM",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDicomImages()
  }, [medicalRecordId])

  const handleShare = async (dicomId: string) => {
    setLoading(true)
    try {
      const result = await shareDicomAction({
        dicomId,
        doctorEmail
      })

      if (result.success) {
        toastAlert.success({
          title: "Partage réussi",
          description: "L'image DICOM a été partagée avec le médecin"
        })
        setSelectedDicom(null)
        setDoctorEmail("")
      } else {
        toastAlert.error({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors du partage"
        })
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)
      toastAlert.error({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage"
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loader"></div>
      </div>
    )
  }

  if (dicomImages.length === 0) {
    return (
      <div className="text-center py-12">
        <Image className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Aucune image DICOM</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Ce patient n'a pas encore d'images DICOM enregistrées.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Images DICOM ({dicomImages.length})</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dicomImages.map((dicom) => (
          <Card key={dicom.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-muted/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-base">
                    <Image className="mr-2 h-4 w-4 text-primary" />
                    {dicom.type}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    <div className="flex items-center text-xs">
                      <Calendar className="mr-1 h-3.5 w-3.5" />
                      Importée le {format(new Date(dicom.uploadDate), "d MMMM yyyy", { locale: fr })}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/doctor/dicom-viewer?id=${dicom.orthanc_id}`} passHref>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      Visualiser
                    </Button>
                  </Link>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => setSelectedDicom(dicom)}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Partager
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Partager l'image DICOM</DialogTitle>
                        <DialogDescription>
                          Entrez l'adresse email du médecin avec qui vous souhaitez partager cette image.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Input
                          placeholder="Email du médecin"
                          value={doctorEmail}
                          onChange={(e) => setDoctorEmail(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedDicom(null)
                            setDoctorEmail("")
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={() => handleShare(dicom.id)}
                          disabled={loading || !doctorEmail}
                        >
                          {loading ? "Partage en cours..." : "Partager"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {dicom.description && (
                <div className="mt-2">
                  <Badge variant="outline" className="mb-1">Description</Badge>
                  <p className="text-sm text-muted-foreground">{dicom.description}</p>
                </div>
              )}
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs">
                  ID Orthanc: {dicom.orthanc_id.substring(0, 8)}...
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 