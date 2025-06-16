import { FileText, Hospital, CheckCircle, MessageSquare } from "lucide-react";

export const appointmentRequestFields = [
  {
    type: "textarea" as const,
    name: "description",
    label: "Description de votre demande",
    placeholder: "Décrivez vos symptômes ou la raison de votre demande de rendez-vous...",
    required: true,
    width: "full",
    rows: 5,
    icon: <MessageSquare className="h-4 w-4" />,
    helpText: "Soyez précis afin que nous puissions vous orienter vers le service approprié",
  },
  {
    type: "checkbox" as const,
    name: "existingRecord",
    label: "J'ai déjà un dossier médical dans cet hôpital",
    width: "full",
    icon: <FileText className="h-4 w-4" />,
    helpText: "Cochez cette case si vous avez déjà été patient dans cet hôpital",
  },
  {
    type: "hidden" as const,
    name: "hospitalId",
    disabled: true,
    hidden: true,
  },
  {
    type: "select" as const,
    name: "serviceId",
    label: "Service ",
    placeholder: "Sélectionnez un service ",
    width: "full",
    icon: <Hospital className="h-4 w-4" />,
    helpText: "Si vous ne savez pas quel service choisir, laissez ce champ vide",
    options: [],
    dependsOn: "hospitalId",
    async loadOptions(formData: any) {
      try {
        if (!formData.hospitalId) {
          return [];
        }
        
        const { getServicesByHospitalIdAction } = await import("@/actions/service.action");
        const response = await getServicesByHospitalIdAction(formData.hospitalId);
        
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        return [];
      }
    }
  }
]; 