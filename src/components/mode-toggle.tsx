"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"


export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Handle hydration
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    if (!mounted) return (
        <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
            <span className="sr-only">Toggle theme</span>
        </Button>
    )

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-9 h-9 relative overflow-hidden"
                onClick={toggleTheme}
            >
                <motion.div
                    initial={false}
                    animate={{
                        y: theme === "dark" ? 0 : -30,
                        opacity: theme === "dark" ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                >
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        y: theme === "light" ? 0 : 30,
                        opacity: theme === "light" ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
                <span className="sr-only">Toggle theme</span>
            </Button>
        </motion.div>
    )
}