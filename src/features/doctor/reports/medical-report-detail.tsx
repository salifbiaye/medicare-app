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
  Stethoscope,
  User,
  ListChecks,
  Download
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
interface MedicalReport {
  id: string
  content: string
  diagnosis?: string
  recommendations?: string
  createdAt: string | Date
  doctor: {
    user: {
      name: string
    }
    specialty: string
  }
  appointment: {
    date: string | Date
    patient: {
      user: {
        name: string
        email: string
      }
      socialSecurityNumber?: string
    }
  }
}

interface MedicalReportDetailProps {
  report: MedicalReport
}

export default function MedicalReportDetail({ report }: MedicalReportDetailProps) {
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  if (!report) {
    return <div>Rapport médical non trouvé</div>
  }

  const appointmentDate = new Date(report.appointment.date)
  const creationDate = new Date(report.createdAt)

  // Fonction pour générer et télécharger le PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(20);
    doc.text('Rapport Médical', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Date: ${format(creationDate, "PPP", { locale: fr })}`, 105, 30, { align: 'center' });
    
    // Informations patient
    doc.setFontSize(14);
    doc.text('Informations du patient', 20, 45);
    doc.setFontSize(10);
    doc.text(`Nom: ${report.appointment.patient.user.name}`, 20, 55);
    doc.text(`Email: ${report.appointment.patient.user.email}`, 20, 60);
    if (report.appointment.patient.socialSecurityNumber) {
      doc.text(`Numéro de sécurité sociale: ${report.appointment.patient.socialSecurityNumber}`, 20, 65);
    }
    
    // Informations médecin
    doc.setFontSize(14);
    doc.text('Informations du médecin', 20, 80);
    doc.setFontSize(10);
    doc.text(`Nom: Dr. ${report.doctor.user.name}`, 20, 90);
    doc.text(`Spécialité: ${report.doctor.specialty}`, 20, 95);
    doc.text(`Consultation du: ${format(appointmentDate, "PPP", { locale: fr })} à ${format(appointmentDate, "HH:mm", { locale: fr })}`, 20, 100);
    
    // Position de départ pour le contenu
    let yPosition = 115;
    
    // Compte-rendu
    doc.setFontSize(14);
    doc.text('Compte-rendu', 20, yPosition);
    yPosition += 10;
    
    // Utiliser splitTextToSize pour gérer le texte long
    const maxWidth = 170;
    const contentLines = doc.splitTextToSize(report.content, maxWidth);
    doc.setFontSize(10);
    doc.text(contentLines, 20, yPosition);
    
    yPosition += contentLines.length * 5 + 15;
    
    // Diagnostic (s'il existe)
    if (report.diagnosis) {
      // Vérifier s'il faut ajouter une nouvelle page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Diagnostic', 20, yPosition);
      yPosition += 10;
      
      const diagnosisLines = doc.splitTextToSize(report.diagnosis, maxWidth);
      doc.setFontSize(10);
      doc.text(diagnosisLines, 20, yPosition);
      
      yPosition += diagnosisLines.length * 5 + 15;
    }
    
    // Recommandations (si elles existent)
    if (report.recommendations) {
      // Vérifier s'il faut ajouter une nouvelle page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Recommandations', 20, yPosition);
      yPosition += 10;
      
      const recommendationsLines = doc.splitTextToSize(report.recommendations, maxWidth);
      doc.setFontSize(10);
      doc.text(recommendationsLines, 20, yPosition);
    }
    
    // Footer
    const pageCount = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text('Ce rapport médical est un document confidentiel.', 105, 280, { align: 'center' });
      doc.text(`Document généré le ${format(new Date(), "PPP", { locale: fr })}`, 105, 285, { align: 'center' });
    }
    
    // Télécharger le PDF
    const fileName = `rapport_medical_${report.appointment.patient.user.name.replace(/\s+/g, '_')}_${format(creationDate, 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF généré avec succès",
      description: "Votre rapport médical a été téléchargé",
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
            <Button variant="outline" className="gap-2" onClick={generatePDF}>
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>

          {/* Titre du rapport */}
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Rapport Médical</h1>
            <div className="flex justify-center items-center gap-4 text-gray-200 dark:text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4"/>
                {format(creationDate, "PPP", {locale: fr})}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4"/>
                {format(creationDate, "HH:mm", {locale: fr})}
              </span>
            </div>
          </div>
        </div>
      </AnimatedLayout>

      {/* Contenu du document */}
      <div ref={contentRef} className="px-8 py-6 ">
        {/* Informations sur le patient et le médecin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5 text-primary"/>
                Informations du patient
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Nom</dt>
                  <dd className="font-medium">{report.appointment.patient.user.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd>{report.appointment.patient.user.email}</dd>
                </div>
                {report.appointment.patient.socialSecurityNumber && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Numéro de sécurité sociale</dt>
                    <dd>{report.appointment.patient.socialSecurityNumber}</dd>
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
                  <dd className="font-medium">Dr. {report.doctor.user.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Spécialité</dt>
                  <dd>{report.doctor.specialty}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Consultation du</dt>
                  <dd>
                    {format(appointmentDate, "PPP", { locale: fr })} à{" "}
                    {format(appointmentDate, "HH:mm", { locale: fr })}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Contenu du rapport */}
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Compte-rendu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="whitespace-pre-line">
                {report.content}
              </div>
            </CardContent>
          </Card>

          {report.diagnosis && (
            <Card>
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Diagnostic
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="whitespace-pre-line">
                  {report.diagnosis}
                </div>
              </CardContent>
            </Card>
          )}

          {report.recommendations && (
            <Card>
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="whitespace-pre-line">
                  {report.recommendations}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>Ce rapport médical est un document confidentiel.</p>
          <p>Document généré le {format(new Date(), "PPP", { locale: fr })}</p>
        </div>
      </div>
    </div>
  )
} 