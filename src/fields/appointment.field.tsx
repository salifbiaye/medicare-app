import { User, Calendar, Clock, FileText, MessageSquare } from "lucide-react";
import { FieldConfig } from "@/components/data-form"
import { format } from "date-fns"
import { getPatientsAction } from "@/actions/appointment.action";

export const appointmentFields: FieldConfig[] = [
  {
    id: "patientId",
    name: "patientId",
    type: "select",
    label: "Patient",
    placeholder: "Sélectionnez un patient",
    required: true,
    validation: {
      required: "Veuillez sélectionner un patient",
    },
    width: "full",
    icon: <User className="h-4 w-4" />,
    helpText: "Sélectionnez le patient pour ce rendez-vous",
    options: [],
    async loadOptions() {
      try {
    
        const response = await getPatientsAction();
        
        if (response.success && response.data) {
          return response.data.map(patient => ({
            value: patient.id,
            label: `${patient.firstName} ${patient.lastName}`
          }));
        }
        return [];
      } catch (error) {
        console.error("Erreur lors du chargement des patients:", error);
        return [];
      }
    }
  },
  {
    id: "date",
    name: "date",
    type: "datetime",
    label: "Date et heure",
    required: true,
    defaultValue: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    validation: {
      required: "Veuillez sélectionner une date et une heure",
    },
    width: "full",
    icon: <Calendar className="h-4 w-4" />,
    helpText: "Sélectionnez la date et l'heure du rendez-vous",
  },
  {
    id: "status",
    name: "status",
    type: "select",
    label: "Statut",
    required: true,
    defaultValue: "pending",
    options: [
      { value: "pending", label: "En attente" },
      { value: "confirmed", label: "Confirmé" },
      { value: "completed", label: "Terminé" },
      { value: "cancelled", label: "Annulé" },
    ],
    validation: {
      required: "Veuillez sélectionner un statut",
    },
    width: "full",
    icon: <Clock className="h-4 w-4" />,
    helpText: "Sélectionnez le statut du rendez-vous",
  },
  {
    id: "notes",
    name: "notes",
    type: "textarea",
    label: "Notes",
    placeholder: "Ajoutez des notes importantes...",
    validation: {
      maxLength: {
        value: 1000,
        message: "Les notes ne peuvent pas dépasser 1000 caractères",
      },
    },
    width: "full",
    icon: <FileText className="h-4 w-4" />,
    helpText: "Ajoutez des notes supplémentaires pour ce rendez-vous",
    rows: 4,
  },
];
