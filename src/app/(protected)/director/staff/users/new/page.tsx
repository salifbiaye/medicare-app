import { Metadata } from "next";

import CreateUserPage from "@/features/admin/users/create-user";

export const metadata: Metadata = {
    title: "Nouvel utilisateur",
    description: "Créez un nouvel utilisateur",
};

export default function NewUserPage() {
    return (
        <div className="container mx-auto py-10">
            <CreateUserPage/>
        </div>
    );
} 