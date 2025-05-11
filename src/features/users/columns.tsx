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
import { deleteUser } from "@/actions/user.action"

// Define the User type based on your Prisma model
export type User = {
  id: string
  email: string
  name: string
  gender: "MALE" | "FEMALE"
  role: "USER" | "ADMIN"
  profileCompleted: boolean
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
  image?: string | null
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => {
      return (
        <div className="truncate font-medium max-w-[100px]" title={row.getValue("id")}>
          {row.getValue("id")}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue("role") as "USER" | "ADMIN"
      return <Badge variant={role === "ADMIN" ? "default" : "secondary"}>{role}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
    cell: ({ row }) => {
      return <div>{row.getValue("gender")}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "profileCompleted",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Profile Status" />,
    cell: ({ row }) => {
      const isCompleted = row.getValue("profileCompleted") as boolean
      return <Badge variant={isCompleted ? "success" : "destructive"}>{isCompleted ? "Completed" : "Incomplete"}</Badge>
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as boolean
      return value.includes(rowValue.toString())
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      return <div>{format(new Date(row.getValue("createdAt")), "PPP")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

      const handleDelete = async () => {
        try {
          const result = await deleteUser(user.id)
          
          if (!result.success) {
            throw new Error(result.error || "Failed to delete user")
          }

          toastAlert.success({
            title: "User deleted",
            description: "The user has been successfully deleted.",
          })

          window.location.reload()
        } catch (error) {
          console.error(error)
          toastAlert.error({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to delete user",
          })
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = `/users/${user.id}`}>View user details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = `/users/${user.id}/edit`}>Edit user</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            title="Delete User"
            description="Are you sure you want to delete this user? This action cannot be undone."
            confirmText="Delete"
          />
        </>
      )
    },
  },
]
