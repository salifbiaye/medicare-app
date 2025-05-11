"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, Lock, Syringe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "@/features/auth/logout-button"
import { navigationConfig } from "@/lib/nav-config"
import { Role, User } from "@prisma/client"
import { motion } from "framer-motion"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav({ user }: { user: User }) {
    const pathname = usePathname()

    const getUserInitials = () => {
        if (!user?.name) return "U"
        return user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    const hasAccess = (routeRoles: Role[]) => {
        return routeRoles.includes(user.role)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-gray-700 dark:bg-zinc-900 ">
            <div className="flex h-16 items-center px-4 md:px-6">
                {/* Logo avec animation */}
                <div className="flex items-center gap-2 font-bold text-xl mr-6">
                    <Link
                        href="/"
                        aria-label="home"
                        className="group flex items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-[40px] p-2 space-x-2 transition-all duration-300 hover:shadow-md"
                    >
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Syringe className="text-blue-600 dark:text-blue-400" />
                        </motion.div>
                    </Link>
                </div>

                {/* Navigation principale */}
                <nav className="hidden md:flex items-center space-x-1 flex-1">
                    {navigationConfig.map((route) => {
                        const hasRouteAccess = hasAccess(route.roles)
                        const isCurrentRoute = pathname.startsWith(route.href)

                        if (!hasRouteAccess) return null

                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 ${
                                    isCurrentRoute
                                        ? "text-primary bg-accent dark:bg-accent/20"
                                        : "text-muted  dark:text-muted-foreground hover:text-primary hover:bg-accent/80"
                                }`}
                            >
                                {route.title}
                            </Link>
                        )
                    })}
                </nav>

                {/* Contrôles utilisateur (desktop) */}
                <div className="hidden md:flex items-center justify-center gap-4 ml-auto">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-9 w-9 mb-1 hover:bg-accent"
                            >
                                <Avatar className="h-9 w-9 border">
                                    {user?.image ? (
                                        <AvatarImage src={user.image} alt={user.name || "Avatar"} />
                                    ) : (
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <span className="sr-only">Profil utilisateur</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 bg-popover border"
                        >
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{user?.name || "Utilisateur"}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {navigationConfig.map((route) => {
                                if (!hasAccess(route.roles)) return null

                                return (
                                    <DropdownMenuItem
                                        key={route.href}
                                        className="hover:bg-accent focus:bg-accent cursor-pointer"
                                    >
                                        <Link href={route.href} className="flex w-full items-center gap-1">
                                            {route.title}
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            })}
                            <DropdownMenuSeparator />

                            <LogoutButton className="w-full justify-start rounded-none px-2 py-1.5 text-sm" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Menu mobile */}
                <div className="md:hidden ml-auto flex items-center gap-2">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full  h-9 w-9 mb-1  hover:bg-accent"
                            >
                                <Avatar className="h-9 w-9 border">
                                    {user?.image ? (
                                        <AvatarImage src={user.image} alt={user.name || "Avatar"} />
                                    ) : (
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 bg-popover border"
                        >
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{user?.name || "Utilisateur"}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {navigationConfig.map((route) => {
                                if (!hasAccess(route.roles)) return null

                                return (
                                    <DropdownMenuItem
                                        key={route.href}
                                        className="hover:bg-accent focus:bg-accent cursor-pointer"
                                    >
                                        <Link href={route.href} className="flex w-full items-center gap-1">
                                            {route.title}
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            })}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:bg-accent focus:bg-accent cursor-pointer">
                                <Link href="/account" className="flex w-full">
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <LogoutButton className="w-full justify-start rounded-none px-2 py-1.5 text-sm" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}