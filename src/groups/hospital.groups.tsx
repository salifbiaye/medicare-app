import {Building2} from "lucide-react";
import React from "react";

export const createHospitalgroups = [
    {
        title: "Informations de base",
        description: "Entrez les informations principales de l'hôpital",
        fields: ["name", "address", "phone", "email"],
        icon: <Building2 className="h-5 w-5" />,
    },
]