import { Home, User, Calendar, Users, Activity } from "lucide-react";

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

interface NavItem {
    id: string;
    title: string;
    href: string;
    icon: React.ReactNode;
    roles: Role[];
    badge?: number;
    isProtectedRoute?: boolean;
}

export const navigationConfig = () => {
    const config: NavItem[] = [
        {
            id: "dashboard",
            title: "Dashboard",
            href: "/dashboard",
            icon: <Home className="w-5 h-5" />,
            roles: [Role.USER, Role.ADMIN],
        },
        {
            id: "training",
            title: "Training",
            href: "/training",
            icon: <Activity className="w-5 h-5" />,
            roles: [Role.USER, Role.ADMIN],
        },
        {
            id: "account",
            title: "Account",
            href: "/account",
            icon: <User className="w-5 h-5" />,
            roles: [Role.USER, Role.ADMIN],
        },
        {
            id: "calendar",
            title: "Calendar",
            href: "/calendar",
            icon: <Calendar className="w-5 h-5" />,
            roles: [Role.USER, Role.ADMIN],
        },
        {
            id: "users",
            title: "Users",
            href: "/users",
            icon: <Users className="w-5 h-5" />,
            roles: [Role.ADMIN], // Seulement pour les admins
        },
    ];

    return config;
};

