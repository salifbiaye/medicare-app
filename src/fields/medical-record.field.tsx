import { Phone } from "lucide-react"
import type { CreateMedicalRecordFormValues } from "@/schemas/medical-record.schema"

// Définition du type FieldConfig pour ce fichier spécifique
interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig<T> {
  type: string;
  name: keyof T & string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  disabled?: boolean;
  defaultValue?: any;
  width?: "full" | "half" | "third" | "quarter";
  helpText?: string;
  hidden?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  icon?: React.ReactNode;
  tooltip?: string;
  loadOptions?: () => Promise<FieldOption[]>;
  dependsOn?: string;
}

export const createMedicalRecordFields: FieldConfig<CreateMedicalRecordFormValues>[] = [
  {
    type: "text",
    name: "phoneNumber",
    label: "Numéro de téléphone",
    placeholder: "Numéro de téléphone pour le dossier médical",
    required: false,
    icon: <Phone className="h-4 w-4" />,
    helpText: "Numéro de téléphone à contacter pour ce dossier médical (si différent du téléphone du patient)",
  },
] 