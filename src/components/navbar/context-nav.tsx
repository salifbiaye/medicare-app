"use client"

import { usePathname } from "next/navigation"
import { SubNav } from "./sub-nav"
import { navigationConfig } from "@/lib/nav-config"
import { User } from "@prisma/client"

interface ContextNavProps {
    user: User
}

export function ContextNav({ user }: ContextNavProps) {
    const pathname = usePathname()

    // Déterminer la section active
    let section = navigationConfig[0].href
    for (let item of navigationConfig)
        if (pathname.startsWith(item.href))
            section = item.href

    return <SubNav section={section} user={user} />
}