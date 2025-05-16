import {
  AlarmClock,
  CalendarIcon,
  FileText,
  Image,
  ListChecks,
  Stethoscope,
  Tag
} from "lucide-react"
import type {
  CreateMedicalReportFormValues,
  CreatePrescriptionFormValues,
  CreateDicomImageFormValues
} from "@/schemas/medical-document.schema"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getCompletedAppointmentsAction } from "@/actions/appointment.action"

// Définition du type FieldConfig pour ce fichier spécifique
interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig<T> {
  type: string;
  name: keyof T & string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  disabled?: boolean;
  defaultValue?: any;
  width?: "full" | "half" | "third" | "quarter";
  helpText?: string;
  hidden?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  icon?: React.ReactNode;
  tooltip?: string;
  loadOptions?: () => Promise<FieldOption[]>;
  dependsOn?: string;
}

// Interface pour les rendez-vous
interface Appointment {
  id: string;
  date: string | Date;
  patient: {
    user: {
      name: string;
    }
  }
}

// Fields for medical report form
export const medicalReportFields: FieldConfig<CreateMedicalReportFormValues>[] = [
  {
    type: "select",
    name: "appointmentId",
    label: "Rendez-vous associé",
    placeholder: "Sélectionnez le rendez-vous lié à ce rapport",
    required: true,
    icon: <CalendarIcon className="h-4 w-4" />,
    helpText: "Le rendez-vous auquel ce rapport médical est lié",
    loadOptions: async () => {
      try {
        const result = await getCompletedAppointmentsAction()
        
        if (!result.success || !result.data) {
          return []
        }
        
        const appointments = result.data as Appointment[]

        return appointments.map((appointment: Appointment) => ({
          value: appointment.id,
          label: `${format(new Date(appointment.date), "dd/MM/yyyy HH:mm", { locale: fr })} - ${appointment.patient.user.name}`
        }))
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error)
        return []
      }
    }
  },
  {
    type: "textarea",
    name: "content",
    label: "Contenu du rapport",
    placeholder: "Saisissez le contenu complet du rapport médical",
    required: true,
    icon: <FileText className="h-4 w-4" />,
    helpText: "Description détaillée de la consultation, observations et résultats",
    rows: 10,
  },
  {
    type: "textarea",
    name: "diagnosis",
    label: "Diagnostic",
    placeholder: "Saisissez le diagnostic établi",
    required: false,
    icon: <Stethoscope className="h-4 w-4" />,
    helpText: "Diagnostic établi suite à la consultation",
    rows: 4,
  },
  {
    type: "textarea",
    name: "recommendations",
    label: "Recommandations",
    placeholder: "Saisissez les recommandations pour le patient",
    required: false,
    icon: <ListChecks className="h-4 w-4" />,
    helpText: "Recommandations et conseils pour le patient",
    rows: 4,
  },
]

// Fields for prescription form
export const prescriptionFields: FieldConfig<CreatePrescriptionFormValues>[] = [
  {
    type: "textarea",
    name: "content",
    label: "Contenu de la prescription",
    placeholder: "Saisissez le contenu complet de la prescription",
    required: true,
    icon: <FileText className="h-4 w-4" />,
    helpText: "Liste des médicaments, posologie et instructions pour le patient",
    rows: 10,
  },
  {
    type: "date",
    name: "startDate",
    label: "Date de début",
    placeholder: "Sélectionnez la date de début de la prescription",
    required: true,
    icon: <CalendarIcon className="h-4 w-4" />,
    helpText: "Date à laquelle la prescription prend effet",
  },
  {
    type: "date",
    name: "endDate",
    label: "Date de fin",
    placeholder: "Sélectionnez la date de fin de la prescription",
    required: false,
    icon: <AlarmClock className="h-4 w-4" />,
    helpText: "Date à laquelle la prescription prend fin (laisser vide si indéterminée)",
  },
  {
    type: "select",
    name: "status",
    label: "Statut",
    placeholder: "Sélectionnez le statut de la prescription",
    required: true,
    icon: <Tag className="h-4 w-4" />,
    helpText: "Statut actuel de la prescription",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Terminée" },
      { value: "CANCELLED", label: "Annulée" },
    ],
  },
]

// Fields for DICOM image form
export const dicomImageFields: FieldConfig<CreateDicomImageFormValues>[] = [
  {
    type: "text",
    name: "orthanc_id",
    label: "ID Orthanc",
    placeholder: "Saisissez l'identifiant Orthanc de l'image",
    required: true,
    icon: <Tag className="h-4 w-4" />,
    helpText: "Identifiant unique de l'image sur le serveur Orthanc",
  },
  {
    type: "select",
    name: "type",
    label: "Type d'image",
    placeholder: "Sélectionnez le type d'image",
    required: true,
    icon: <Image className="h-4 w-4" />,
    helpText: "Type d'examen ou d'image DICOM",
    options: [
      { value: "IRM", label: "IRM" },
      { value: "Scanner", label: "Scanner" },
      { value: "Radiographie", label: "Radiographie" },
      { value: "Échographie", label: "Échographie" },
      { value: "Mammographie", label: "Mammographie" },
      { value: "Autre", label: "Autre" },
    ],
  },
  {
    type: "textarea",
    name: "description",
    label: "Description",
    placeholder: "Saisissez une description de l'image",
    required: false,
    icon: <FileText className="h-4 w-4" />,
    helpText: "Description détaillée de l'image et de son contexte",
    rows: 4,
  },
] 