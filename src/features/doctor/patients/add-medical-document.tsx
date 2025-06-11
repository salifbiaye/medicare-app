"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import type { FieldOption } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import {
  CreateMedicalReportFormValues,
  createMedicalReportSchema,
  CreatePrescriptionFormValues,
  createPrescriptionSchema
} from "@/schemas/medical-document.schema"
import {
  medicalReportFields,
  prescriptionFields
} from "@/fields/medical-document.field"
import {
  medicalReportGroups,
  prescriptionGroups
} from "@/groups/medical-document.groups"
import { FileText, FilePlus2, Image, User, Upload, Loader2 } from "lucide-react"
import {
  createMedicalReportAction,
  createPrescriptionAction,
  createDicomImageAction
} from "@/actions/patient.action"
import { PatientWithUser } from "./columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MedicalRecord {
  id: string
  patientId: string
  phoneNumber?: string | null
  createdAt: Date
  updatedAt: Date
}

interface AddMedicalDocumentPageProps {
  patient: PatientWithUser
  medicalRecord: MedicalRecord
  documentType: "medicalreport" | "prescription" | "dicomimage"
  patientId: string
}

// Interface pour la réponse d'Orthanc
interface OrthancResponse {
  ID: string
  ParentPatient: string
  ParentSeries: string
  ParentStudy: string
  Path: string
  Status: string
}

// URL de l'API
const API_URL = '/api/orthanc';

export default function AddMedicalDocumentPage({
                                                 patient,
                                                 medicalRecord,
                                                 documentType,
                                                 patientId
                                               }: AddMedicalDocumentPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Type for field parameters
  type FieldParams = {
    patientId?: string
  }

  // Type for field config
  type FieldConfig<T> = {
    type: string
    name: keyof T & string
    label: string
    placeholder?: string
    required?: boolean
    options?: FieldOption[]
    disabled?: boolean
    defaultValue?: any
    width?: "full" | "half" | "third" | "quarter"
    helpText?: string
    hidden?: boolean
    min?: number
    max?: number
    step?: number
    rows?: number
    icon?: React.ReactNode
    tooltip?: string
    loadOptions?: (params: FieldParams) => Promise<FieldOption[]>
    dependsOn?: string
  }

  // Pass patientId to the medical document fields
  const medicalReportFieldsWithPatientId = medicalReportFields.map((field: FieldConfig<any>) => {
    if (field.name === 'appointmentId' && field.loadOptions) {
      return {
        ...field,
        loadOptions: async (params: FieldParams) => {
          if (!field.loadOptions) return []
          return field.loadOptions({ ...params, patientId })
        }
      }
    }
    return field
  })

  const prescriptionFieldsWithPatientId = prescriptionFields.map((field: FieldConfig<any>) => {
    if (field.name === 'appointmentId' && field.loadOptions) {
      return {
        ...field,
        loadOptions: async (params: FieldParams) => {
          if (!field.loadOptions) return []
          return field.loadOptions({ ...params, patientId })
        }
      }
    }
    return field
  })
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [orthancResponse, setOrthancResponse] = useState<OrthancResponse | null>(null)

  // Get the appropriate title, icon, and schema based on document type
  const getDocumentTypeInfo = () => {
    switch (documentType) {
      case "medicalreport":
        return {
          title: "Ajouter un rapport médical",
          description: "Complétez le formulaire pour ajouter un rapport médical au dossier du patient.",
          icon: <FileText className="h-8 w-8 text-primary" />,
          schema: createMedicalReportSchema,
          fields: medicalReportFields,
          groups: medicalReportGroups,
          buttonText: "Enregistrer le rapport médical"
        }
      case "prescription":
        return {
          title: "Ajouter une prescription",
          description: "Complétez le formulaire pour ajouter une prescription au dossier du patient.",
          icon: <FilePlus2 className="h-8 w-8 text-primary" />,
          schema: createPrescriptionSchema,
          fields: prescriptionFields,
          groups: prescriptionGroups,
          buttonText: "Enregistrer la prescription"
        }
      case "dicomimage":
        return {
          title: "Ajouter une image DICOM",
          description: "Téléchargez un fichier DICOM pour l'ajouter au dossier du patient.",
          icon: <Image className="h-8 w-8 text-primary" />,
          buttonText: "Enregistrer l'image DICOM"
        }
      default:
        return {
          title: "Ajouter un document",
          description: "Complétez le formulaire pour ajouter un document au dossier du patient.",
          icon: <FileText className="h-8 w-8 text-primary" />,
          schema: createMedicalReportSchema,
          fields: medicalReportFields,
          groups: medicalReportGroups,
          buttonText: "Enregistrer le document"
        }
    }
  }

  const documentInfo = getDocumentTypeInfo()

  const handleCreateMedicalReport = async (values: CreateMedicalReportFormValues) => {
    setIsLoading(true)
    try {
      // Add required IDs to the form values
      const data = {
        ...values,
        patientId: patient.id,
        medicalRecordId: medicalRecord.id
      }

      const result = await createMedicalReportAction(data)

      if (!result.success) {
        throw new Error(result.error || "Une erreur est survenue lors de la création du rapport médical")
      }

      toastAlert.success({
        title: "Rapport médical créé avec succès",
        description: "Le rapport médical a été ajouté au dossier du patient.",
      })

      // Redirect to the patient's page
      router.push(`/doctor/patients/${patient.id}`)
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la création du rapport médical",
        description: error instanceof Error
            ? error.message
            : "Une erreur s'est produite lors de la création du rapport médical. Veuillez réessayer.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePrescription = async (values: CreatePrescriptionFormValues) => {
    setIsLoading(true)
    try {
      // Add required IDs to the form values
      const data = {
        ...values,
        patientId: patient.id,
        medicalRecordId: medicalRecord.id
      }

      const result = await createPrescriptionAction(data)

      if (!result.success) {
        throw new Error(result.error || "Une erreur est survenue lors de la création de la prescription")
      }

      toastAlert.success({
        title: "Prescription créée avec succès",
        description: "La prescription a été ajoutée au dossier du patient.",
      })

      // Redirect to the patient's page
      router.push(`/doctor/patients/${patient.id}`)
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la création de la prescription",
        description: error instanceof Error
            ? error.message
            : "Une erreur s'est produite lors de la création de la prescription. Veuillez réessayer.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadDicomToOrthanc = async () => {
    if (!selectedFile) {
      toastAlert.error({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier DICOM à télécharger.",
      })
      return
    }

    setIsLoading(true)
    setUploadProgress(0)

    try {
      // Vérifier d'abord si le serveur Orthanc est disponible via notre API
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout après 5 secondes

        const checkResponse = await fetch(`${API_URL}`, {
          signal: controller.signal,
          method: 'GET'
        });

        clearTimeout(timeoutId);

        if (!checkResponse.ok) {
          throw new Error(`Le serveur Orthanc a répondu avec une erreur: ${checkResponse.statusText}`);
        }
      } catch (serverErr) {
        if (serverErr instanceof Error && serverErr.name === 'AbortError') {
          throw new Error("Le serveur Orthanc ne répond pas (délai d'attente dépassé). Vérifiez que le serveur est en cours d'exécution.");
        } else {
          throw new Error(`Impossible de se connecter au serveur Orthanc: ${serverErr instanceof Error ? serverErr.message : String(serverErr)}`);
        }
      }

      // Créer un FormData pour l'upload via l'API
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Utiliser XMLHttpRequest pour suivre la progression
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Créer une promesse pour gérer la réponse
      const uploadPromise = new Promise<OrthancResponse>((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (error) {
                reject(new Error('Erreur lors de l\'analyse de la réponse'));
              }
            } else {
              reject(new Error(`Erreur ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };

        // Gérer les erreurs réseau
        xhr.onerror = () => {
          reject(new Error("Erreur réseau lors de la communication avec le serveur. Vérifiez votre connexion."));
        };

        xhr.ontimeout = () => {
          reject(new Error("Délai d'attente dépassé lors de la communication avec le serveur."));
        };
      });

      // Configurer et envoyer la requête via notre API
      xhr.open('POST', `${API_URL}/instances`, true);
      xhr.timeout = 30000; // 30 secondes de timeout
      xhr.send(formData);

      try {
        // Attendre la réponse
        const response = await uploadPromise;
        setOrthancResponse(response);

        // Enregistrer les informations dans la base de données
        const result = await createDicomImageAction({
          type: "dicom",
          orthanc_id: response.ID,
          description: `Image DICOM pour ${patient.user.name}`,
          medicalRecordId: medicalRecord.id
        });

        if (!result.success) {
          throw new Error(result.error || "Une erreur est survenue lors de l'enregistrement des informations de l'image DICOM");
        }

        toastAlert.success({
          title: "Image DICOM ajoutée avec succès",
          description: "L'image DICOM a été téléchargée et ajoutée au dossier du patient.",
        });

        // Rediriger vers la page du visualiseur DICOM avec l'ID
        router.push(`/doctor/dicom-viewer?id=${response.ID}`);
      } catch (err) {
        throw err;
      }
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors du téléchargement de l'image DICOM",
        description: error instanceof Error
            ? error.message
            : "Une erreur s'est produite lors du téléchargement de l'image DICOM. Veuillez réessayer.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (values: any) => {
    switch (documentType) {
      case "medicalreport":
        return handleCreateMedicalReport(values as CreateMedicalReportFormValues)
      case "prescription":
        return handleCreatePrescription(values as CreatePrescriptionFormValues)
      case "dicomimage":
        return uploadDicomToOrthanc()
      default:
        return
    }
  }

  // Rendu du formulaire DICOM spécifique
  const renderDicomUploadForm = () => {
    return (
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              {documentInfo.icon}
              <div>
                <CardTitle>{documentInfo.title}</CardTitle>
                <CardDescription>{documentInfo.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".dcm,.dicom,application/dicom"
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    {selectedFile ? selectedFile.name : "Cliquez pour sélectionner un fichier DICOM"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedFile
                        ? `Taille: ${(selectedFile.size / 1024).toFixed(2)} Ko`
                        : "Format accepté: .dcm, .dicom"}
                  </p>
                </div>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-sm text-center mt-1">{uploadProgress}%</p>
                  </div>
              )}

              <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                >
                  Retour au dossier du patient
                </Button>
                <Button
                    type="button"
                    onClick={uploadDicomToOrthanc}
                    disabled={!selectedFile || isLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Téléchargement...
                      </>
                  ) : (
                      documentInfo.buttonText
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    )
  }

  return (
      <div className="px-4 py-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-xl">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-background dark:text-foreground">
              {patient.user.name}
            </h2>
            <p className="text-background/80 dark:text-foreground/50">{patient.user.email}</p>
            {patient.socialSecurityNumber && (
                <p className="text-sm text-background/60 dark:text-foreground/40">
                  N° SS: {patient.socialSecurityNumber}
                </p>
            )}
          </div>
        </div>

        {documentType === "dicomimage" ? (
            renderDicomUploadForm()
        ) : documentType === "medicalreport" ? (
            <DataForm
                schema={createMedicalReportSchema}
                fields={medicalReportFieldsWithPatientId}
                submitButtonText={documentInfo.buttonText}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                backLink={{
                  text: "Retour au dossier du patient",
                  href: `/doctor/patients/${patient.id}`,
                }}
                title={documentInfo.title}
                description={documentInfo.description}
                layout="standard"
                theme="modern"
                iconHeader={documentInfo.icon}
                groups={medicalReportGroups}
                showProgressBar={false}
                rounded="md"
                animation="fade"
            />
        ) : (
            <DataForm
                schema={createPrescriptionSchema}
                fields={prescriptionFieldsWithPatientId}
                submitButtonText={documentInfo.buttonText}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                backLink={{
                  text: "Retour au dossier du patient",
                  href: `/doctor/patients/${patient.id}`,
                }}
                title={documentInfo.title}
                description={documentInfo.description}
                layout="standard"
                theme="modern"
                iconHeader={documentInfo.icon}
                groups={prescriptionGroups}
                showProgressBar={false}
                rounded="md"
                animation="fade"
            />
        )}
      </div>
  )
}