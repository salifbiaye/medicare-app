import React from 'react';
import { UsersChart } from "@/features/admin/dashboard/users/users-chart";
import { LatestUsers } from "@/features/admin/dashboard/users/latest-users";
import { UserStats } from "@/features/admin/dashboard/users/user-stats";
import { Users, UserCog } from "lucide-react";

const HomePage = () => {
    return (
        <div className="space-y-6 p-6">
            <div className="relative overflow-hidden rounded-lg  bg-gray-700 dark:bg-zinc-900 p-8 text-white shadow-lg">
                <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rotate-12 transform opacity-20">
                    <UserCog className="h-full w-full" />
                </div>
                <div className="absolute left-0 top-0 -mt-4 -ml-4 h-24 w-24 -rotate-12 transform opacity-20">
                    <Users className="h-full w-full" />
                </div>
                <div className="relative">
                    <h1 className="text-3xl font-bold tracking-tight">
                         Utilisateurs
                    </h1>
                    <p className="mt-2 max-w-2xl text-blue-100">
                        Visualisez et gérez tous les utilisateurs de la plateforme, y compris les patients, médecins, secrétaires et directeurs.
                    </p>
                </div>
            </div>
            <UserStats />
            <div className="grid gap-6 md:grid-cols-2">
                <UsersChart />
                <LatestUsers />
            </div>
        </div>
    );
};

export default HomePage;