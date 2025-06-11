import { Calendar, FileText } from "lucide-react"

export const appointmentGroups = [
  {
    id: "appointment-info",
    title: "Informations du rendez-vous",
    description: "Informations principales du rendez-vous",
    icon: <Calendar className="h-5 w-5" />,
    fields: ["patientId", "date", "status"],
  },
  {
    id: "notes",
    title: "Notes",
    description: "Notes additionnelles",
    icon: <FileText className="h-5 w-5" />,
    fields: ["notes"],
  },
]
