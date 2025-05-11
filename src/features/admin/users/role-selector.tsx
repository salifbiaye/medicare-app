"use client"
import { Card } from "@/components/ui/card"
import { User2, UserCog, Stethoscope, ClipboardList, Building2 } from "lucide-react"

type Role = "PATIENT" | "DOCTOR" | "CHIEF_DOCTOR" | "SECRETARY" | "DIRECTOR" | "ADMIN"

interface RoleSelectorProps {
    selectedRole: Role
    onRoleChange: (role: Role) => void
}

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
    const roles = [
        {
            id: "PATIENT",
            label: "Patient",
            icon: <User2 className="h-6 w-6" />,
            description: "Créer un compte patient",
        },
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
        },
        {
            id: "DIRECTOR",
            label: "Directeur",
            icon: <Building2 className="h-6 w-6" />,
            description: "Créer un compte directeur",
        },
    ]

    return (
        <div className="mb-8 w-full">

            <div className=" w-full flex flex-col justify-center items-center lg:flex-row  gap-4 ">
                {roles.map((role) => (
                    <Card
                        key={role.id}
                        className={`p-4 cursor-pointer w-full transition-all hover:shadow-md ${
                            selectedRole === role.id
                                ? "border-2 border-primary bg-primary/5"
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
                                <h3 className="font-medium">{role.label}</h3>
                                <p className="text-xs text-muted-foreground">{role.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
