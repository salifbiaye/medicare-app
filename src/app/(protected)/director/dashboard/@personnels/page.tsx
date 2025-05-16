import React from 'react';
import { PersonnelStats } from "@/features/director/dashboard/personnels/personnel-stats";
import { PersonnelsChart } from "@/features/director/dashboard/personnels/personnels-chart";
import { LatestPersonnels } from "@/features/director/dashboard/personnels/latest-personnels";

const PersonnelsPage = () => {
    return (
        <div className="space-y-6 p-6">
            <PersonnelStats />
            <PersonnelsChart />
            <LatestPersonnels />
        </div>
    );
};

export default PersonnelsPage;