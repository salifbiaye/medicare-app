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
import { MoreHorizontal, User, FileText, FilePlus2, CalendarDays } from "lucide-react"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toastAlert } from "@/components/ui/sonner-v2"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"

export type PatientWithUser = {
  id: string
  userId: string
  socialSecurityNumber?: string | null
  bloodGroup?: string | null
  allergies?: string | null
  user: {
    id: string
    name: string
    email: string
    phone?: string | null
    gender: string
    birthDate?: Date | null
    createdAt: Date
  }
  medicalRecord?: {
    id: string
  } | null
}

export const columns: ColumnDef<PatientWithUser>[] = [
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
    accessorKey: "user.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
    cell: ({ row }) => {
      const name = row.original.user.name
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <div className="font-medium">{name}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return <div>{row.original.user.email}</div>
    },
  },
  {
    accessorKey: "user.phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
    cell: ({ row }) => {
      const phone = row.original.user.phone
      return phone ? <div>{phone}</div> : <Badge variant="outline">Non renseigné</Badge>
    },
  },
  {
    accessorKey: "socialSecurityNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Numéro SS" />,
    cell: ({ row }) => {
      const ssn = row.original.socialSecurityNumber
      return ssn ? <div>{ssn}</div> : <Badge variant="outline">Non renseigné</Badge>
    },
  },
  {
    accessorKey: "medicalRecord",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dossier médical" />,
    cell: ({ row }) => {
      const hasMedicalRecord = !!row.original.medicalRecord
      return hasMedicalRecord ? (
        <Badge variant="success" className="bg-green-100 text-green-800">
          <FileText className="mr-1 h-3 w-3" />
          Existant
        </Badge>
      ) : (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <FilePlus2 className="mr-1 h-3 w-3" />
          À créer
        </Badge>
      )
    },
  },
  {
    accessorKey: "user.birthDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date de naissance" />,
    cell: ({ row }) => {
      const birthDate = row.original.user.birthDate
      return birthDate ? (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {format(new Date(birthDate), "dd MMMM yyyy", { locale: fr })}
        </div>
      ) : (
        <Badge variant="outline">Non renseigné</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original
      const router = useRouter()
      const hasMedicalRecord = !!patient.medicalRecord

      const handleViewOrCreate = () => {
        if (hasMedicalRecord) {
          // Voir le dossier médical existant
          router.push(`/doctor/patients/${patient.id}`)
        } else {
          // Créer un nouveau dossier médical
          router.push(`/doctor/patients/new?patientId=${patient.id}`)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.id)}>
              Copier l'ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewOrCreate}>
              {hasMedicalRecord ? (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Voir le dossier médical
                </>
              ) : (
                <>
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Créer un dossier médical
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 