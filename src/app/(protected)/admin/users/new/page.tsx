import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nouvel utilisateur",
    description: "Créez un nouvel utilisateur",
};

export default function NewUserPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold">Nouvel utilisateur</h1>
        </div>
    );
} 