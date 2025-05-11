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
import { MoreHorizontal } from "lucide-react"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toastAlert } from "@/components/ui/sonner-v2"
import { deleteUserAction } from "@/actions/user.action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"

export type User = {
  id: string
  email: string
  name: string
  gender: "MALE" | "FEMALE"
  role: "PATIENT" | "DOCTOR" | "CHIEF_DOCTOR" | "SECRETARY" | "DIRECTOR" | "ADMIN"
  profileCompleted: boolean
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
  image?: string | null
}

function getInitiales(nomComplet?: string): string {
  if (!nomComplet) return '??';

  const noms = nomComplet.trim().split(/\s+/);

  if (noms.length === 1) {
    return noms[0].charAt(0).toUpperCase();
  }

  return `${noms[0].charAt(0)}${noms[noms.length - 1].charAt(0)}`.toUpperCase();
}

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "image",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Profil" />,
    cell: ({ row }) => {
      return (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 border">
              {row.getValue("image") ? (
                  <AvatarImage
                      src={row.getValue("image")}
                      alt="Photo de profil"
                      className="object-cover"
                  />
              ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitiales(row.getValue("name"))}
                  </AvatarFallback>
              )}
            </Avatar>
          </div>
      )
    },
    enableHiding: true,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({column}) => <DataTableColumnHeader column={column} title="Nom"/>,
    cell: ({row}) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "email",
    header: ({column}) => <DataTableColumnHeader column={column} title="Email"/>,
    cell: ({row}) => {
      return <div>{row.getValue("email")}</div>
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
    cell: ({ row }) => {
      const role = row.getValue("role") as User["role"]
      const variant =
          role === "ADMIN" ? "default" :
              role === "DOCTOR" || role === "CHIEF_DOCTOR" ? "success" :
                  role === "SECRETARY" ? "warning" :
                      role === "DIRECTOR" ? "destructive" :
                          role === "PATIENT" ? "secondary" : "outline"

      const roleEnFrancais = {
        "ADMIN": "Administrateur",
        "DOCTOR": "Docteur",
        "CHIEF_DOCTOR": "Médecin chef",
        "SECRETARY": "Secrétaire",
        "DIRECTOR": "Directeur",
        "PATIENT": "Patient"
      }[role] || role

      return <Badge variant={variant}>{roleEnFrancais}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Genre" />,
    cell: ({ row }) => {
      const gender = row.getValue("gender") as User["gender"]
      const variant =
          gender === "MALE" ? "default" : "destructive"
      const genreEnFrancais = {
        "MALE": "Homme",
        "FEMALE": "Femme",
      }[gender] || gender

      return <Badge variant={variant}>{genreEnFrancais}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "profileCompleted",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut du profil" />,
    cell: ({ row }) => {
      const isCompleted = row.getValue("profileCompleted") as boolean
      return <Badge variant={isCompleted ? "success" : "destructive"}>
        {isCompleted ? "Complet" : "Incomplet"}
      </Badge>
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as boolean
      return value.includes(rowValue.toString())
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
      const user = row.original
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const router = useRouter()

      const handleDelete = async () => {
        try {
          const result = await deleteUserAction(user.id)

          if (!result.success) {
            throw new Error(result.error || "Échec de la suppression de l'utilisateur")
          }

          toastAlert.success({
            title: "Utilisateur supprimé",
            description: "L'utilisateur a été supprimé avec succès.",
          })

        } catch (error) {
          console.error(error)
          toastAlert.error({
            title: "Erreur",
            description: error instanceof Error ? error.message : "Échec de la suppression de l'utilisateur",
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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                  Copier l'ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
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
                title="Supprimer l'utilisateur"
                description="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
                confirmText="Supprimer"
            />
          </>
      )
    },
  },
]