import { Metadata } from "next";
import { ServiceRepository } from "@/repository/service.repository";
import CreateServicePage from "@/features/director/services/create-service";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Nouveau service",
    description: "Créez un nouveau service médical",
};

export default async function NewServicePage() {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    
    // Récupérer l'ID de l'hôpital du directeur
    let hospitalId: string | undefined = undefined;
    
    if (session?.user?.id) {
        const director = await ServiceRepository.getDirectorByUserId(session.user.id);
        if (director) {
            hospitalId = director.hospitalId;
        }
    }
    
    return (
        <div className="py-10">
            <CreateServicePage hospitalId={hospitalId} />
        </div>
    );
} 