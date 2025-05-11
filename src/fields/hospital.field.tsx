import { Building2, MapPin, Phone, Mail } from "lucide-react"
import React from "react"

export const createHospitalfields = [
  // Groupe 1: Informations de base
  {
    type: "text",
    name: "name",
    label: "Nom de l'hôpital",
    placeholder: "Entrez le nom de l'hôpital",
    required: true,
    icon: <Building2 className="h-4 w-4" />,
    helpText: "Nom complet de l'établissement",
  },
  {
    type: "text",
    name: "address",
    label: "Adresse",
    placeholder: "Entrez l'adresse complète",
    required: true,
    icon: <MapPin className="h-4 w-4" />,
    helpText: "Adresse postale de l'hôpital",
  },
  {
    type: "text",
    name: "phone",
    label: "Téléphone",
    placeholder: "Entrez le numéro de téléphone",
    required: true,
    icon: <Phone className="h-4 w-4" />,
    helpText: "Numéro de téléphone principal",
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "exemple@hopital.com",
    required: false,
    icon: <Mail className="h-4 w-4" />,
    helpText: "Adresse email de contact",
  },
]

// Groupes pour le layout wizard
