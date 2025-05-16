"use client"
import type { User } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { User2, AtSignIcon, PhoneIcon, MapPinIcon, CalendarIcon } from "lucide-react"

import { toastAlert } from "@/components/ui/sonner-v2"
import { DataForm } from "@/components/data-form"
import {PersonalInfoFormValues, personalInfoSchema} from "@/schemas/user.schema";
import {personalInfoGroups} from "@/groups/user.groups";
import {personalInfoFields} from "@/fields/user.field";
import {updateUserAction} from "@/actions/user.action";

type ProfilePersonalInfoProps = {
  user: User
  onUpdateSuccess?: () => void
  onUpdateError?: () => void
}

export function ProfilePersonalInfo({
  user,
  onUpdateSuccess,
  onUpdateError,
}: ProfilePersonalInfoProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  // Conversion de la date pour l'initialisation du formulaire
  const initialData = {
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    gender: user.gender,
    birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
  }

  const handleUpdateInfo = async (data: PersonalInfoFormValues) => {
    setIsUpdating(true)
    try {
       await updateUserAction(user.id,data)
      
      toastAlert.success({
        title: "Profil mis à jour",
        description: "Vos informations personnelles ont été mises à jour avec succès.",
      })
      
      if (onUpdateSuccess) onUpdateSuccess()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      toastAlert.error({
        title: "Échec de la mise à jour",
        description: "Une erreur est survenue lors de la mise à jour de vos informations.",
      })
      
      if (onUpdateError) onUpdateError()
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DataForm

      schema={personalInfoSchema}
      fields={personalInfoFields}
      initialData={initialData}
      submitButtonText="Enregistrer les modifications"
      isLoading={isUpdating}
      onSubmit={handleUpdateInfo}
      title="Profil Personnel"
      description="Mettez à jour vos informations personnelles"
      layout="steps"
      theme="modern"
      iconHeader={<User2 className="h-8 w-8 text-primary" />}
      groups={personalInfoGroups}
      showProgressBar={true}
      rounded="md"
      animation="fade"
    />
  )
}
