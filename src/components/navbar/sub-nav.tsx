"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search, ChevronRight } from "lucide-react"
import { navigationConfig } from "@/lib/nav-config"
import type { Role, User } from "@prisma/client"
import { motion } from "framer-motion"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

// Mise à jour du type pour correspondre à votre structure actuelle
interface NavItem {
    id: string
    title: string
    href: string
    icon: React.ReactNode
    roles: Role[]
    badge?: number
    isProtectedRoute?: boolean
    subNav?: NavItem[]
}

interface SubNavProps {
    section: string
    user: User
}

export function SubNav({ section, user }: SubNavProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = React.useState(false)

    // Pour suivre le sous-sous-menu actif
    const [activeSubSection, setActiveSubSection] = React.useState<string | null>(null)


    // Check if user has access to a specific route based on roles
    const hasAccessToRoute = React.useCallback(
        (routeRoles: Role[]) => {
            // If no roles specified, everyone has access
            if (!routeRoles || routeRoles.length === 0) return true
            // Check if user's role is in the route's allowed roles
            return routeRoles.includes(user.role)
        },
        [user.role],
    )

    // Récursion pour obtenir toutes les routes accessibles
    const getAllRoutes = React.useCallback(
        (navItems: NavItem[], parentSection?: string): any[] => {
            let routes: any[] = []
            navItems.forEach((navItem) => {
                if (hasAccessToRoute(navItem.roles)) {
                    routes.push({
                        title: navItem.title,
                        href: navItem.href,
                        section: parentSection || navItem.href,
                    })

                    if (navItem.subNav && navItem.subNav.length > 0) {
                        routes = [...routes, ...getAllRoutes(navItem.subNav, navItem.href)]
                    }
                }
            })
            return routes
        },
        [hasAccessToRoute],
    )

    // Get all routes that the user has access to for search functionality
    const allRoutes = React.useMemo(() => {
        return getAllRoutes(navigationConfig)
    }, [getAllRoutes])

    // Keyboard shortcut for opening command dialog
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Handle command selection
    const onSelect = React.useCallback(
        (href: string) => {
            router.push(href)
            setOpen(false)
        },
        [router],
    )

    // Trouver le niveau principal de navigation
    const currentMainNav = navigationConfig.find((item) => item.href === section)
    const subRoutes = currentMainNav?.subNav || []
    const accessibleSubRoutes = subRoutes.filter((route) => hasAccessToRoute(route.roles))

    // Déterminer automatiquement quel sous-menu est actif en fonction du pathname
    React.useEffect(() => {
        // Si aucun sous-menu actif n'est défini, essayons de le déterminer
        if (accessibleSubRoutes.length > 0) {
            let foundActiveSection = false

            // D'abord, regardons si le pathname correspond exactement à l'un des chemins
            for (const route of accessibleSubRoutes) {
                if (pathname === route.href || pathname.startsWith(route.href + "/")) {
                    setActiveSubSection(route.href)
                    foundActiveSection = true
                    break
                }
                // Vérifier aussi dans les sous-menus des sous-menus
                if (route.subNav) {
                    const foundInSubSubNav = route.subNav.some(
                        (subRoute) => pathname === subRoute.href || pathname.startsWith(subRoute.href + "/"),
                    )
                    if (foundInSubSubNav) {
                        setActiveSubSection(route.href)
                        foundActiveSection = true
                        break
                    }
                }
            }

            // Si aucun n'est trouvé et qu'aucun n'est actif, définir le premier comme actif par défaut
            if (!foundActiveSection && !activeSubSection && accessibleSubRoutes.length > 0) {
                setActiveSubSection(accessibleSubRoutes[0].href)
            }
        }
    }, [pathname, accessibleSubRoutes])

    // Trouver le sous-menu actif pour afficher ses sous-menus
    const activeSubNav = accessibleSubRoutes.find((route) => route.href === activeSubSection)
    const hasSubSubNav = activeSubNav?.subNav && activeSubNav.subNav.length > 0
    const accessibleSubSubRoutes = activeSubNav?.subNav?.filter((route) => hasAccessToRoute(route.roles)) || []

    // Return null after all hooks have been called
    if (accessibleSubRoutes.length === 0) return null

    // Fonction pour naviguer vers la route principale ou afficher les sous-routes
    const handleMainRouteClick = (route: NavItem, e: React.MouseEvent) => {
        setActiveSubSection(route.href)

        // Toujours naviguer vers la route principale quand on clique sur le bouton
        router.push(route.href)
    }

    return (
        <>
            <div className="border-b border-border bg-muted">


                {/* Premier niveau de sous-navigation */}
                <div className="flex h-14 items-center justify-between px-4 md:px-6 border-b border-border/40">
                    <nav className="flex items-center space-x-1">
                        {accessibleSubRoutes.map((route) => {
                            const isActive = activeSubSection === route.href
                            const hasNestedSubNav = route.subNav && route.subNav.length > 0

                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`relative font-medium px-3 py-2 text-sm transition-colors flex items-center gap-1.5 rounded-md ${
                                        isActive
                                            ? "text-primary bg-primary/5 hover:bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}

                                >
                                    {route.icon && <span className="mr-1">{route.icon}</span>}
                                    {route.title}
                                    {hasNestedSubNav && (
                                        <ChevronRight
                                            className={`h-3.5 w-3.5 transition-transform ${isActive && hasSubSubNav ? "rotate-90" : ""}`}
                                        />
                                    )}

                                    {isActive && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                            layoutId="activeIndicatorL1"
                                            transition={{
                                                type: "spring",
                                                stiffness: 350,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="relative max-w-md hidden md:flex cursor-pointer" onClick={() => setOpen(true)}>
                            <div className="flex items-center h-9 gap-4 w-full bg-muted rounded-md border border-input px-4 py-2 text-sm text-muted-foreground max-w-[300px]">
                                <Search className="h-4 w-4 mr-2" />
                                <span>Chercher...</span>
                                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Deuxième niveau de sous-navigation (sous-sous-menus) */}
                {hasSubSubNav && (
                    <div className="flex h-12 items-center px-4 md:px-6  bg-gray-600 dark:bg-background/50">
                        <nav className="flex items-center space-x-1 ml-6">
                            {accessibleSubSubRoutes.map((subRoute) => {
                                const isActive = pathname === subRoute.href || pathname.endsWith(subRoute.href + "/")

                                return (
                                    <Link
                                        key={subRoute.href}
                                        href={subRoute.href}
                                        className={`relative font-medium px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5 rounded-md ${
                                            isActive
                                                ? "text-primary bg-accent dark:bg-primary/5 a76"
                                                : "text-white dark:text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                    >
                                        {subRoute.icon && <span className="mr-1">{subRoute.icon}</span>}
                                        {subRoute.title}

                                        {isActive && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                                layoutId="activeIndicatorL2"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                )}
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Chercher dans l'application..." />
                <CommandList>
                    <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                        {allRoutes.map((route) => (
                            <CommandItem key={route.href} onSelect={() => onSelect(route.href)} className="flex items-center gap-2">
                                <span>{route.title}</span>

                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
