"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Stethoscope } from "lucide-react"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toastAlert } from "@/components/ui/sonner-v2"
import { deleteServiceAction } from "@/actions/service.action"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"

// Type mapping for ServiceType to French labels
const serviceTypeLabels: Record<string, string> = {
  GENERAL_PRACTICE: "Médecine générale",
  OPHTHALMOLOGY: "Ophtalmologie",
  CARDIOLOGY: "Cardiologie",
  PEDIATRICS: "Pédiatrie",
  DERMATOLOGY: "Dermatologie",
  NEUROLOGY: "Neurologie",
  ORTHOPEDICS: "Orthopédie",
  GYNECOLOGY: "Gynécologie",
  RADIOLOGY: "Radiologie",
  PSYCHIATRY: "Psychiatrie",
  UROLOGY: "Urologie",
  ENT: "ORL",
}

export type Service = {
  id: string
  type: string
  name: string | null
  description: string | null
  hospitalId: string
  hospitalName: string
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<Service>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          <Badge variant="outline">{serviceTypeLabels[type] || type}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
    cell: ({ row }) => {
      const name = row.getValue("name") as string | null
      return <div>{name || <Badge variant="outline">Non renseigné</Badge>}</div>
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null
      return description ? 
        <div className="max-w-[300px] truncate">{description}</div> : 
        <Badge variant="outline">Non renseigné</Badge>
    },
  },
  {
    accessorKey: "hospitalName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hôpital" />,
    cell: ({ row }) => {
      return <div>{row.getValue("hospitalName")}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date de création" />,
    cell: ({ row }) => {
      return <div>{format(new Date(row.getValue("createdAt")), "dd MMMM yyyy", { locale: fr })}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const router = useRouter()

      const handleDelete = async () => {
        try {
          const result = await deleteServiceAction(service.id)

          if (!result.success) {
            throw new Error(result.error || "Échec de la suppression du service")
          }

          toastAlert.success({
            title: "Service supprimé",
            description: "Le service a été supprimé avec succès.",
          })
          
        } catch (error) {
          console.error(error)
          toastAlert.error({
            title: "Erreur",
            description: error instanceof Error ? error.message : "Échec de la suppression du service",
          })
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(service.id)}>
                Copier l'ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/director/services/${service.id}`)}>
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/director/services/${service.id}/edit`)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            title="Supprimer le service"
            description="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible."
            confirmText="Supprimer"
          />
        </>
      )
    },
  },
] 