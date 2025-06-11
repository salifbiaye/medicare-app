import { MessageSquare, Hospital } from "lucide-react";

export const appointmentRequestGroup = {
  title: "Demande de rendez-vous",
  description: "Veuillez remplir le formulaire ci-dessous pour demander un rendez-vous",
  fields: ["description", "existingRecord", "serviceId", "hospitalId"],
  icon: <MessageSquare className="h-5 w-5" />,
};

export const appointmentRequestGroups = [appointmentRequestGroup]; 