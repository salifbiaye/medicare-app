import { Metadata } from "next";


import ImportPersonnelPage from "@/features/director/personnels/import";

export const metadata: Metadata = {
    title: "Nouvel utilisateur",
    description: "Créez un nouvel utilisateur",
};

export default function NewUserPage() {
    return (
        <div className=" py-10">
            <ImportPersonnelPage/>
        </div>
    );
}