import React from 'react';
import { UsersChart } from "@/features/admin/dashboard/users/users-chart";
import { LatestUsers } from "@/features/admin/dashboard/users/latest-users";
import { UserStats } from "@/features/admin/dashboard/users/user-stats";
import { Users, UserCog } from "lucide-react";

const HomePage = () => {
    return (
        <div className="space-y-6 p-6">

            <UserStats />
            <UsersChart />
            <LatestUsers />
        </div>
    );
};

export default HomePage;