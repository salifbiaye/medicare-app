// Group definitions for medical document forms
// These groups organize form fields for better visual structure

export const medicalReportGroups = [
  {
    id: "reportDetails",
    title: "Détails du rapport médical",
    description: "Informations principales du rapport médical",
    fields: ["appointmentId", "content"],
  },
  {
    id: "diagnosticInfo",
    title: "Diagnostic et recommandations",
    description: "Diagnostic établi et recommandations pour le patient",
    fields: ["diagnosis", "recommendations"],
  },
]

export const prescriptionGroups = [
  {
    id: "prescriptionContent",
    title: "Contenu de la prescription",
    description: "Médicaments et posologie",
    fields: ["content"],
  },
  {
    id: "prescriptionDetails",
    title: "Détails de la prescription",
    description: "Période de validité et statut",
    fields: ["startDate", "endDate", "status"],
  },
]

export const dicomImageGroups = [
  {
    id: "imageDetails",
    title: "Détails de l'image DICOM",
    description: "Informations sur l'image médicale",
    fields: ["orthanc_id", "type", "description"],
  },
] 