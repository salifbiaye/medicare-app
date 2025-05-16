import { Metadata } from "next";

import CreateHospitalPage from "@/features/admin/hospitals/create-hospital";

export const metadata: Metadata = {
    title: "Nouvel hôpital",
    description: "Créez un nouvel hôpital",
};

export default function NewHospitalPage() {
    return (
        <div className=" py-10">
            <CreateHospitalPage/>
        </div>
    );
} 