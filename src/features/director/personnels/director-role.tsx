"use client"

import { Card } from "@/components/ui/card"
import { Stethoscope, ClipboardList } from "lucide-react"

type Role = "DOCTOR" | "SECRETARY"

interface RoleSelectorProps {
    selectedRole: Role
    onRoleChange: (role: Role) => void
}

export default function DirectorRoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
    const roles = [
        {
            id: "DOCTOR",
            label: "Médecin",
            icon: <Stethoscope className="h-6 w-6" />,
            description: "Créer un compte médecin",
        },
        {
            id: "SECRETARY",
            label: "Secrétaire",
            icon: <ClipboardList className="h-6 w-6" />,
            description: "Créer un compte secrétaire",
        }
    ]

    return (
        <div className="mb-8 w-full">
            <div className="w-full flex flex-col justify-center items-center lg:flex-row gap-4">
                {roles.map((role) => (
                    <Card
                        key={role.id}
                        className={`p-4 bg-gray-600 dark:bg-card cursor-pointer w-full transition-all hover:shadow-md ${
                            selectedRole === role.id
                                ? "border-2 border-primary bg-gray-900 text-foreground dark:bg-primary/5"
                                : "border border-border hover:border-primary/50"
                        }`}
                        onClick={() => onRoleChange(role.id as Role)}
                    >
                        <div className="flex flex-col items-center text-center gap-2">
                            <div
                                className={`p-3 rounded-full ${
                                    selectedRole === role.id ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                            >
                                {role.icon}
                            </div>
                            <div>
                                <h3 className="font-medium text-white">{role.label}</h3>
                                <p className="text-xs text-white dark:text-muted-foreground">{role.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}