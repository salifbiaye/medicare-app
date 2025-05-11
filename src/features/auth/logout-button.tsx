"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"
import { authClient } from "@/lib/authClient"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
    className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleLogout = async () => {
        setIsLoading(true)
        await authClient.signOut({fetchOptions:{
                onSuccess: () => {
                    router.push("/")
                }
            }})
    }

    return (
        <Button
            variant="ghost"
            className={`text-red-500 hover:text-red-400 hover:bg-red-500/10 ${className}`}
            onClick={handleLogout}
            disabled={isLoading}
        >
            <LogOut className="h-5 w-5 mr-2" />
            {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <span>Se déconnecter</span>}
        </Button>
    )
}