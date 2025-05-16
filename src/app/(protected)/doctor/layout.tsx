import { ContextNav } from '@/components/navbar/context-nav';
import { MainNav } from '@/components/navbar/main-nav';
import { auth } from '@/lib/auth';
import { UserRepository } from '@/repository/user.repository';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
import {SecretaryService} from "@/services/secretary.service";
import {Building, Stethoscope} from "lucide-react";
import {DoctorService} from "@/services/doctor.service";

type LayoutProps = {
    children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {

    const header = await headers()
    const session = await auth.api.getSession({ headers: header })

    if (!session?.user) {
        redirect('/login')
    }

    const user = await UserRepository.getUserById(session.user.id)

    if (!user) {
        redirect('/login')
    }
    const data = await  DoctorService.findDoctor();
    const hospitalInfo = data.data.hospital;
    const serviceInfo = data.data.service

    return (
        <div className="flex flex-col min-h-screen bg-background ">
            <div
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 shadow-md border border-blue-200 dark:border-blue-800 mb-8">
                <div
                    className="absolute top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-800/20 rounded-full -mt-20 -mr-20 opacity-20"></div>
                <div
                    className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-200 dark:bg-indigo-800/20 rounded-full -mb-10 -ml-10 opacity-20"></div>

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                            <Building className="h-5 w-5"/>
                            {hospitalInfo.name}
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{hospitalInfo.address}</p>
                    </div>

                    <div
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-900/50 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                        <Stethoscope className="h-4 w-4 text-indigo-600 dark:text-indigo-400"/>
                        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Service: {serviceInfo.name || serviceInfo.type}
                </span>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6">{children}</main>
        </div>
    );
};

export default Layout;