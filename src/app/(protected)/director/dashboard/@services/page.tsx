import React from 'react';
import { ServicesStats } from "@/features/director/dashboard/services/services-stats";
import { ServicesChart } from "@/features/director/dashboard/services/services-chart";
import { LatestServices } from "@/features/director/dashboard/services/latest-services";

const ServicesPage = () => {
    return (
        <div className="space-y-6 p-6">
            <ServicesStats />
            <div className="grid gap-6 md:grid-cols-2">
                <LatestServices />
                <ServicesChart />
            </div>
        </div>
    );
};

export default ServicesPage;