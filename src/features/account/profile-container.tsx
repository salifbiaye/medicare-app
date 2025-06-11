"use client"

import { useState } from "react"
import type { User } from "@prisma/client"
import { ProfileHeader } from "./profile-header"
import { ProfileTabs } from "./profile-tabs"
import { ProfilePersonalInfo } from "./profile-personal-info"
import { ProfileSecurity } from "./profile-security"

import { ProfileNotifications } from "./profile-notifications"
import { useToast } from "@/hooks/use-toast"

type ProfileContainerProps = {
  user: User
}

type TabType = "personal" | "security" | "notifications"

export function ProfileContainer({ user }: ProfileContainerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateSuccess = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès.",
      variant: "success",
    })
    setIsUpdating(false)
  }

  const handleUpdateError = () => {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la mise à jour de votre profil.",
      variant: "destructive",
    })
    setIsUpdating(false)
  }

  return (
    <div className="  py-8 ">
      <ProfileHeader user={user} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />
        </div>

        <div className="lg:col-span-9">
          <div className="overflow-hidden rounded-xl bg-background shadow-sm border">
            {activeTab === "personal" && (
              <ProfilePersonalInfo
                user={user}
                onUpdateSuccess={handleUpdateSuccess}
                onUpdateError={handleUpdateError}

              />
            )}

            {activeTab === "security" && (
              <ProfileSecurity
                onUpdateSuccess={handleUpdateSuccess}
                onUpdateError={handleUpdateError}
              />
            )}

            {activeTab === "notifications" && <ProfileNotifications userId={user.id} />}
          </div>
        </div>
      </div>
    </div>
  )
}
