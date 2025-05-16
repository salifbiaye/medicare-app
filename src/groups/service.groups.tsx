import { Stethoscope } from "lucide-react";
import React from "react";

export const createServiceGroups = [
    {
        title: "Informations du service",
        description: "Entrez les informations principales du service médical",
        fields: ["type", "name", "description", "hospitalId"],
        icon: <Stethoscope className="h-5 w-5" />,
    },
] 