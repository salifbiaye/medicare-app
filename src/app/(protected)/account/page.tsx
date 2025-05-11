import type { Metadata } from "next"
import { ProfileContainer } from "@/features/account/profile-container"

import { redirect } from "next/navigation"
import {getCurrentUserAction} from "@/actions/user.action";

export const metadata: Metadata = {
    title: "Profil Utilisateur | Système de Gestion Médicale",
    description: "Gérez votre profil et vos informations personnelles",
}

export default async function ProfilePage() {
    const userResult = await getCurrentUserAction()

    if (!userResult.success || !userResult.data) {
        redirect("/login")
    }
    console.log("userResult", userResult.data)

    return <ProfileContainer user={userResult.data} />
}
