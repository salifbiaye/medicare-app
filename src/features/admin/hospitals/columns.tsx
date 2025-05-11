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
import { MoreHorizontal, Building2 } from "lucide-react"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toastAlert } from "@/components/ui/sonner-v2"
import { deleteHospitalAction } from "@/actions/hospital.action"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"

export type Hospital = {
  id: string
  name: string
  address: string
  phone: string
  email?: string | null
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<Hospital>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Adresse" />,
    cell: ({ row }) => {
      return <div>{row.getValue("address")}</div>
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
    cell: ({ row }) => {
      return <div>{row.getValue("phone")}</div>
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null
      return email ? <div>{email}</div> : <Badge variant="outline">Non renseigné</Badge>
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
      const hospital = row.original
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const router = useRouter()

      const handleDelete = async () => {
        try {
          const result = await deleteHospitalAction(hospital.id)

          if (!result.success) {
            throw new Error(result.error || "Échec de la suppression de l'hôpital")
          }

          toastAlert.success({
            title: "Hôpital supprimé",
            description: "L'hôpital a été supprimé avec succès.",
          })

        } catch (error) {
          console.error(error)
          toastAlert.error({
            title: "Erreur",
            description: error instanceof Error ? error.message : "Échec de la suppression de l'hôpital",
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(hospital.id)}>
                Copier l'ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/admin/hospitals/${hospital.id}`)}>
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/hospitals/${hospital.id}/edit`)}>
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
            title="Supprimer l'hôpital"
            description="Êtes-vous sûr de vouloir supprimer cet hôpital ? Cette action est irréversible."
            confirmText="Supprimer"
          />
        </>
      )
    },
  },
] 