import { Metadata } from "next"
import ImportHospitalsPage from "@/features/admin/hospitals/import"

export const metadata: Metadata = {
  title: "Importer des hôpitaux",
  description: "Importez plusieurs hôpitaux à partir d'un fichier Excel ou CSV",
}

export default function HospitalsPage() {
  return (
    <div className="container mx-auto py-10">
      <ImportHospitalsPage />
    </div>
  )
} 