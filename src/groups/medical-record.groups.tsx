import { Phone } from "lucide-react"

export const createMedicalRecordGroups = [
  {
    title: "Informations de contact",
    description: "Informations de contact spécifiques au dossier médical",
    fields: ["phoneNumber"],
    icon: <Phone className="h-5 w-5" />,
  },
] 