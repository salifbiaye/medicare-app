import { UserIcon, HeartPulse } from "lucide-react";

// Group for the first step - Basic patient information
export const patientBasicInfoGroup = {
    title: "Informations personnelles",
    description: "Veuillez saisir vos informations personnelles de base",
    fields: ["name", "email", "gender", "birthDate", "phone"],
    icon: <UserIcon className="h-5 w-5" />,
};

// Group for the second step - Medical information
export const patientMedicalInfoGroup = {
    title: "Informations médicales",
    description: "Veuillez saisir vos informations médicales (facultatif)",
    fields: ["socialSecurityNumber", "bloodGroup", "allergies"],
    icon: <HeartPulse className="h-5 w-5" />,
};

// Groups for the stepper form
export const patientOnboardingGroups = [
    patientBasicInfoGroup,
    patientMedicalInfoGroup,
]; 