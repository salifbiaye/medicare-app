import { Metadata } from "next";
import { redirect } from "next/navigation";
import DirectorCreateUserPage from "@/features/director/personnels/director-create-user";
import { UserRepository } from "@/repository/user.repository";
import { UserService } from "@/services/user.service";

export const metadata: Metadata = {
    title: "Nouveau personnels",
    description: "Créez un nouveau membre du personnels pour votre hôpital",
};

export default async function NewUserPage() {
    // Récupérer l'utilisateur courant
    const currentUserResult = await UserService.getUserCurrent();
    
    // Vérifier si l'utilisateur est connecté et est un directeur
    if (!currentUserResult.success || !currentUserResult.data || currentUserResult.data.role !== "DIRECTOR") {
        redirect("/");
    }
    
    // Récupérer le directeur et son hôpital
    const director = await UserRepository.getDirectorByUserId(currentUserResult.data.id);
    if (!director) {
        redirect("/");
    }

    return (
        <div className="py-10">
            <DirectorCreateUserPage hospitalId={director.hospitalId} />
        </div>
    );
} 