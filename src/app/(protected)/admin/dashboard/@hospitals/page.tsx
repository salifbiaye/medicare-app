import React from 'react';
import { HospitalStats } from "@/features/admin/dashboard/hospitals/hospital-stats";
import { LatestHospitals } from "@/features/admin/dashboard/hospitals/latest-hospitals";
import { HospitalsChart } from "@/features/admin/dashboard/hospitals/hospitals-chart";


const HospitalsPage = () => {
    return (
        <div className="space-y-6 p-6">
            {/*<div className="relative overflow-hidden rounded-lg bg-gray-700 dark:bg-zinc-900 p-8 text-white shadow-lg">*/}
            {/*    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rotate-12 transform opacity-20">*/}
            {/*        <Building2 className="h-full w-full" />*/}
            {/*    </div>*/}
            {/*    <div className="absolute left-0 top-0 -mt-4 -ml-4 h-24 w-24 -rotate-12 transform opacity-20">*/}
            {/*        <Hospital className="h-full w-full" />*/}
            {/*    </div>*/}
            {/*    <div className="relative">*/}
            {/*        <h1 className="text-3xl font-bold tracking-tight">*/}
            {/*            Hôpitaux*/}
            {/*        </h1>*/}
            {/*        <p className="mt-2 max-w-2xl text-blue-100">*/}
            {/*            Visualisez et gérez tous les hôpitaux de la plateforme, suivez leur évolution et leurs statistiques.*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <HospitalStats />
            <div className="grid gap-6 md:grid-cols-2">
                <LatestHospitals />
                <HospitalsChart />
            </div>
        </div>
    );
};

export default HospitalsPage; 