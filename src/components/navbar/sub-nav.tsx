"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search, Lock, Command } from "lucide-react"
import { navigationConfig } from "@/lib/nav-config"
import { Role, User } from "@prisma/client"
import { motion } from "framer-motion"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"

interface SubNavProps {
    section: string
    user: User
}

export function SubNav({ section, user }: SubNavProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = React.useState(false)

    // Check if user has access to a specific route based on roles
    const hasAccessToRoute = React.useCallback((routeRoles: Role[]) => {
        // If no roles specified, everyone has access
        if (!routeRoles || routeRoles.length === 0) return true;
        // Check if user's role is in the route's allowed roles
        return routeRoles.includes(user.role);
    }, [user.role]);

    // Get all routes that the user has access to for search functionality
    const allRoutes = React.useMemo(() => {
        let routes: any[] = [];
        navigationConfig.forEach(navItem => {
            if (navItem.subNav && navItem.subNav.length > 0) {
                navItem.subNav.forEach(subRoute => {
                    if (hasAccessToRoute(subRoute.roles)) {
                        routes.push({
                            title: ` ${subRoute.title}`,
                            href: subRoute.href,
                            section: navItem.href
                        });
                    }
                });
            }
        });
        return routes;
    }, [hasAccessToRoute]);

    // Keyboard shortcut for opening command dialog
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Handle command selection
    const onSelect = React.useCallback((href: string) => {
        router.push(href);
        setOpen(false);
    }, [router]);

    const subRoutes = navigationConfig.find(item => item.href === section)?.subNav || [];
    const accessibleSubRoutes = subRoutes.filter(route => hasAccessToRoute(route.roles));

    // Return null after all hooks have been called
    if (accessibleSubRoutes.length === 0) return null;

    return (
        <>
            <div className="border-b border-border bg-muted">
                <div className="flex mt-2 h-12 items-center justify-between px-4 md:px-6">
                    <nav className="flex items-center space-x-4">
                        {accessibleSubRoutes.map((route) => {
                            const isActive = pathname === route.href || pathname.startsWith(route.href + '/');
                            const requiresSpecificRole = route.roles && route.roles.length > 0;

                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`relative font-bold px-1 py-3 text-sm font-medium transition-colors flex items-center gap-1 ${
                                        isActive
                                            ? "text-primary bg-accent rounded-lg dark:bg-accent/20"
                                            : "text-muted-foreground hover:text-primary"
                                    }`}
                                >
                                    {route.title}

                                    {isActive && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                            layoutId="activeIndicator"
                                            transition={{
                                                type: "spring",
                                                stiffness: 350,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div
                            className="relative max-w-md hidden md:flex cursor-pointer"
                            onClick={() => setOpen(true)}
                        >
                            <div className="flex items-center h-9 gap-4 w-full bg-background rounded-md border border-input px-4 py-2 text-sm text-muted-foreground max-w-[300px]">
                                <Search className="h-4 w-4 mr-2" />
                                <span>Chercher...</span>
                                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Chercher dans l'application..." />
                <CommandList>
                    <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                        {allRoutes.map((route) => (
                            <CommandItem
                                key={route.href}
                                onSelect={() => onSelect(route.href)}
                                className="flex items-center gap-2"
                            >
                                <span>{route.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}