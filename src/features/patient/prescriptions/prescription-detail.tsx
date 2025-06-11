"use client"

import React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftIcon,
  CalendarIcon,
  Clock,
  FileText,
  Download,
  Stethoscope,
  User,
  AlertCircle,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import { useToast } from "@/hooks/use-toast"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { PrescriptionStatus } from "@prisma/client"

// Définition des types
interface Prescription {
  id: string
  content: string
  startDate: string | Date
  endDate?: string | Date | null
  createdAt: string | Date
  status: PrescriptionStatus
  patient: {
    user: {
      name: string
      email: string
    }
    socialSecurityNumber?: string
  }
  doctor: {
    user: {
      name: string
    }
    specialty: string
  }
}

interface PrescriptionDetailProps {
  prescription: Prescription
}

export function PrescriptionDetail({ prescription }: PrescriptionDetailProps) {
  const { toast } = useToast()
  const creationDate = new Date(prescription.createdAt)
  const startDate = new Date(prescription.startDate)
  const endDate = prescription.endDate ? new Date(prescription.endDate) : null

  const getStatusBadgeVariant = (status: PrescriptionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "COMPLETED":
        return "secondary"
      case "CANCELLED":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: PrescriptionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "En cours"
      case "COMPLETED":
        return "Terminée"
      case "CANCELLED":
        return "Annulée"
      default:
        return status
    }
  }

  // Fonction pour générer et télécharger le PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(20);
    doc.text('Prescription Médicale', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Date: ${format(creationDate, "PPP", { locale: fr })}`, 105, 30, { align: 'center' });
    
    // Informations patient
    doc.setFontSize(14);
    doc.text('Informations du patient', 20, 45);
    doc.setFontSize(10);
    doc.text(`Nom: ${prescription.patient.user.name}`, 20, 55);
    doc.text(`Email: ${prescription.patient.user.email}`, 20, 60);
    if (prescription.patient.socialSecurityNumber) {
      doc.text(`Numéro de sécurité sociale: ${prescription.patient.socialSecurityNumber}`, 20, 65);
    }
    
    // Informations médecin
    doc.setFontSize(14);
    doc.text('Informations du médecin', 20, 80);
    doc.setFontSize(10);
    doc.text(`Nom: Dr. ${prescription.doctor.user.name}`, 20, 90);
    doc.text(`Spécialité: ${prescription.doctor.specialty}`, 20, 95);
    
    // Période de validité
    doc.setFontSize(14);
    doc.text('Période de validité', 20, 110);
    doc.setFontSize(10);
    doc.text(`Date de début: ${format(startDate, "PPP", { locale: fr })}`, 20, 120);
    if (endDate) {
      doc.text(`Date de fin: ${format(endDate, "PPP", { locale: fr })}`, 20, 125);
    } else {
      doc.text(`Sans date de fin définie`, 20, 125);
    }
    
    // Contenu de la prescription
    doc.setFontSize(14);
    doc.text('Contenu de la prescription', 20, 140);
    
    // Utiliser splitTextToSize pour gérer le texte long
    const maxWidth = 170;
    const contentLines = doc.splitTextToSize(prescription.content, maxWidth);
    doc.setFontSize(10);
    doc.text(contentLines, 20, 150);
    
    // Footer
    const pageCount = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text('Cette prescription médicale est un document officiel et confidentiel.', 105, 280, { align: 'center' });
      doc.text(`Document généré le ${format(new Date(), "PPP", { locale: fr })}`, 105, 285, { align: 'center' });
    }
    
    // Télécharger le PDF
    const fileName = `prescription_${prescription.patient.user.name.replace(/\s+/g, '_')}_${format(creationDate, 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF généré avec succès",
      description: "Votre prescription a été téléchargée",
    });
  };

  return (
    <div className="min-h-screen pb-12 pt-6 relative">
      <AnimatedLayout>
        <ParticlesBackground />
        <div className="p-8 rounded-xl">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-8">
            <Link href="/patient/prescriptions" passHref>
              <Button variant="outline" className="gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Retour
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={generatePDF}>
                <Download className="h-4 w-4" />
                Télécharger PDF
              </Button>
            </div>
          </div>

          {/* Carte principale */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Prescription du {format(creationDate, "PPP", { locale: fr })}
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(prescription.status)}>
                      {getStatusLabel(prescription.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Informations du médecin */}
              <div className="rounded-lg border p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  Médecin prescripteur
                </h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Dr. {prescription.doctor.user.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {prescription.doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Période de validité */}
              <div className="rounded-lg border p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  Période de validité
                </h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    Du {format(startDate, "PPP", { locale: fr })}
                  </p>
                  {endDate ? (
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Au {format(endDate, "PPP", { locale: fr })}
                    </p>
                  ) : (
                    <p className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Sans date de fin définie
                    </p>
                  )}
                </div>
              </div>

              {/* Contenu de la prescription */}
              <div className="rounded-lg border p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4 text-primary" />
                  Contenu de la prescription
                </h3>
                <div className="mt-4 whitespace-pre-wrap text-sm">
                  {prescription.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedLayout>
    </div>
  )
} 