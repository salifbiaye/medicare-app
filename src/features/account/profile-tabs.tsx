"use client"

import type { Role } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  User,
  Shield,
  UserCog,
  Activity,
  Bell,
  UserCheck,
  UserPlus,
  Stethoscope,
  UserCogIcon,
  UserCheckIcon,
  UserRound,
} from "lucide-react"

type ProfileTabsProps = {
  activeTab: string
  setActiveTab: (tab: any) => void
  userRole: Role
}

export function ProfileTabs({ activeTab, setActiveTab, userRole }: ProfileTabsProps) {
  const tabs = [
    {
      id: "personal",
      label: "Informations Personnelles",
      icon: User,
    },
    {
      id: "security",
      label: "Sécurité",
      icon: Shield,
    },
    {
      id: "role",
      label: "Informations Professionnelles",
      icon: UserCog,
    },
    {
      id: "activity",
      label: "Activité Récente",
      icon: Activity,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
  ]

  const getRoleIcon = () => {
    switch (userRole) {
      case "PATIENT":
        return UserPlus
      case "DOCTOR":
        return Stethoscope
      case "CHIEF_DOCTOR":
        return UserCogIcon
      case "SECRETARY":
        return UserCheckIcon
      case "DIRECTOR":
        return UserRound
      case "ADMIN":
        return UserCheck
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon()

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-gray-600 dark:bg-muted">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
            <RoleIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">Mon Profil</h3>
            <p className="text-sm text-gray-300">Gérer mes informations</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`w-full justify-start mb-1 ${activeTab === tab.id ? "" : "text-muted-foreground"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}
