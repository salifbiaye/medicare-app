import { Metadata } from "next"
import ImportServicesPage from "@/features/director/services/import"

export const metadata: Metadata = {
  title: "Importer des services",
  description: "Importez plusieurs services à partir d'un fichier Excel ou CSV",
}

export default function ImportPage() {
  return (
    <div className="py-10">
      <ImportServicesPage />
    </div>
  )
} 