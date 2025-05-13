"use client"

import React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface NotificationSearchProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export function NotificationSearch({ searchQuery, setSearchQuery }: NotificationSearchProps) {
    const [query, setQuery] = React.useState(searchQuery);

    React.useEffect(() => {
        const timeout = setTimeout(() => setSearchQuery(query), 300);
        return () => clearTimeout(timeout);
    }, [query, setSearchQuery]);

    return (
        <div className="relative dark:bg-muted  bg-gray-600 rounded-lg">
            <Search className="absolute  left-3 top-2.5 h-4 w-4  text-white" />
            <Input
                placeholder="Rechercher dans les notifications..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-white placeholder:text-white/80"
            />
        </div>
    )
} 