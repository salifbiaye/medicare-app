import { 
  CalendarIcon, 
  FileText, 
  Image,
  ListChecks, 
  Stethoscope, 
  Tag
} from "lucide-react"

// Groups for medical report form
export const medicalReportGroups = [
  {
    title: "Rendez-vous",
    description: "Sélectionnez le rendez-vous associé à ce rapport médical",
    fields: ["appointmentId"],
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    title: "Détails du rapport",
    description: "Saisissez les informations détaillées du rapport médical",
    fields: ["content", "diagnosis", "recommendations"],
    icon: <FileText className="h-5 w-5" />,
  },
]

// Groups for prescription form
export const prescriptionGroups = [
  {
    title: "Contenu de la prescription",
    description: "Rédigez la prescription pour le patient",
    fields: ["content"],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Dates et statut",
    description: "Définissez la période de validité et le statut de la prescription",
    fields: ["startDate", "endDate", "status"],
    icon: <CalendarIcon className="h-5 w-5" />,
  },
]

// Groups for DICOM image form
export const dicomImageGroups = [
  {
    title: "Informations de l'image",
    description: "Identifiez et catégorisez l'image DICOM",
    fields: ["orthanc_id", "type"],
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Description",
    description: "Ajoutez une description détaillée de l'image",
    fields: ["description"],
    icon: <FileText className="h-5 w-5" />,
  },
] 