import { auth } from '@/lib/auth';
import { UserRepository } from '@/repository/user.repository';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
import {Building} from "lucide-react";
import {DirectorService} from "@/services/director.service";

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
    const data = await  DirectorService.findDirector();
    const hospitalInfo = data?.hospital;

    return (
        <div className="flex flex-col min-h-screen bg-background ">
            <div
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-50 to-red-50 dark:from-red-950/30 dark:to-red-950/30 p-4 shadow-md border border-blue-200 dark:border-red-800 mb-8">
                <div
                    className="absolute top-0 right-0 w-64 h-64 bg-red-200 dark:bg-red-800/20 rounded-full -mt-20 -mr-20 opacity-20"></div>
                <div
                    className="absolute bottom-0 left-0 w-40 h-40 bg-red-200 dark:bg-red-800/20 rounded-full -mb-10 -ml-10 opacity-20"></div>

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                            <Building className="h-5 w-5"/>
                            {hospitalInfo?.name}
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-400">{hospitalInfo?.address}</p>
                    </div>

                    
                </div>
            </div>

            <main className="flex-1 p-6">{children}</main>
        </div>
    );
};

export default Layout;