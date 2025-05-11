import { ContextNav } from '@/components/navbar/context-nav';
import { MainNav } from '@/components/navbar/main-nav';
import { auth } from '@/lib/auth';
import { UserRepository } from '@/repository/user.repository';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

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

    return (
        <div className="flex flex-col min-h-screen bg-background ">
            <MainNav user={user} />
            <ContextNav user={user} />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
};

export default Layout;