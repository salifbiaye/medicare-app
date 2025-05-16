import { Stethoscope, Type, Hospital, FileText } from "lucide-react"
import React from "react"

export const createServiceFields = [
  {
    type: "select",
    name: "type",
    label: "Type de service",
    placeholder: "Sélectionnez le type de service",
    required: true,
    icon: <Stethoscope className="h-4 w-4" />,
    helpText: "Spécialité médicale du service",
    options: [
      { label: "Médecine générale", value: "GENERAL_PRACTICE" },
      { label: "Ophtalmologie", value: "OPHTHALMOLOGY" },
      { label: "Cardiologie", value: "CARDIOLOGY" },
      { label: "Pédiatrie", value: "PEDIATRICS" },
      { label: "Dermatologie", value: "DERMATOLOGY" },
      { label: "Neurologie", value: "NEUROLOGY" },
      { label: "Orthopédie", value: "ORTHOPEDICS" },
      { label: "Gynécologie", value: "GYNECOLOGY" },
      { label: "Radiologie", value: "RADIOLOGY" },
      { label: "Psychiatrie", value: "PSYCHIATRY" },
      { label: "Urologie", value: "UROLOGY" },
      { label: "ORL", value: "ENT" },
    ],
  },
  {
    type: "text",
    name: "name",
    label: "Nom du service",
    placeholder: "Entrez le nom du service",
    required: true,
    icon: <Type className="h-4 w-4" />,
    helpText: "Nom du service dans l'hôpital",
  },
  {
    type: "textarea",
    name: "description",
    label: "Description",
    placeholder: "Entrez une description du service",
    required: false,
    icon: <FileText className="h-4 w-4" />,
    helpText: "Description détaillée du service",
  },
  {
    type: "select",
    name: "hospitalId",
    label: "Hôpital",
    placeholder: "Sélectionnez l'hôpital",
    required: true,
    icon: <Hospital className="h-4 w-4" />,
    helpText: "Hôpital auquel ce service est rattaché",
     async loadOptions() {
      try {
        const { getAllHospitalsForSelectAction } = await import("@/actions/hospital.action");
        const response = await getAllHospitalsForSelectAction();

        if (response.success && response.data) {
          return response.data;
        }
        return [];
      } catch (error) {
        console.error("Erreur lors du chargement des hôpitaux:", error);
        return [];
      }
    }
  },
] 