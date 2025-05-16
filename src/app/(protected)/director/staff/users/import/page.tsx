import { Metadata } from "next";

import ImportUsersPage from "@/features/admin/users/import";

export const metadata: Metadata = {
    title: "Nouvel utilisateur",
    description: "Créez un nouvel utilisateur",
};

export default function NewUserPage() {
    return (
        <div className="container mx-auto py-10">
            <ImportUsersPage/>
        </div>
    );
}