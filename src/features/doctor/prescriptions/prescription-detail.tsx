"use client"

import React, { useRef } from "react"
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

// Définition des types
interface Prescription {
  id: string
  content: string
  startDate: string | Date
  endDate?: string | Date | null
  createdAt: string | Date
  status: "ACTIVE" | "COMPLETED" | "CANCELLED"
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

export default function PrescriptionDetail({ prescription }: PrescriptionDetailProps) {
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  if (!prescription) {
    return <div>Prescription non trouvée</div>
  }

  const startDate = new Date(prescription.startDate)
  const endDate = prescription.endDate ? new Date(prescription.endDate) : null
  const creationDate = new Date(prescription.createdAt)

  // Déterminer le statut de la prescription
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
    // Utiliser une autre méthode pour obtenir le nombre de pages
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
            <Link href="/doctor/patients" passHref>
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

          {/* Titre de la prescription */}
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Prescription Médicale</h1>
            <div className="flex justify-center items-center gap-4 text-gray-200 dark:text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(creationDate, "PPP", { locale: fr })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(creationDate, "HH:mm", { locale: fr })}
              </span>
              {getStatusBadge(prescription.status)}
            </div>
          </div>
        </div>
      </AnimatedLayout>
      
      {/* Contenu du document */}
      <div ref={contentRef} className="px-8 py-6">
        {/* Informations sur le patient et le médecin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations du patient
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Nom</dt>
                  <dd className="font-medium">{prescription.patient.user.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd>{prescription.patient.user.email}</dd>
                </div>
                {prescription.patient.socialSecurityNumber && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Numéro de sécurité sociale</dt>
                    <dd>{prescription.patient.socialSecurityNumber}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Informations du médecin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Nom</dt>
                  <dd className="font-medium">Dr. {prescription.doctor.user.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Spécialité</dt>
                  <dd>{prescription.doctor.specialty}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Période de validité */}
        <Card className="mb-8">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Période de validité
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Date de début</div>
                <div className="font-medium">{format(startDate, "PPP", { locale: fr })}</div>
              </div>

              {endDate ? (
                <div>
                  <div className="text-xs text-muted-foreground">Date de fin</div>
                  <div className="font-medium">{format(endDate, "PPP", { locale: fr })}</div>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  Sans date de fin définie
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contenu de la prescription */}
        <Card className="mb-8">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Contenu de la prescription
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="whitespace-pre-line">
              {prescription.content}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>Cette prescription médicale est un document officiel et confidentiel.</p>
          <p>Document généré le {format(new Date(), "PPP", { locale: fr })}</p>
        </div>
      </div>
    </div>
  )
}