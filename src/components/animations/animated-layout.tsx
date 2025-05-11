
"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export function AnimatedLayout({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={`relative rounded-lg mb-4 overflow-hidden ${className}`}>
            <div className="container mx-auto py-6 px-4 relative z-10">
                {children}
            </div>
        </div>
    )
}

export function AnimatedHeader({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex  items-center mb-6"
        >
            {children}
        </motion.div>
    )
}

export function AnimatedCard({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-muted dark:bg-muted/50 rounded-lg border-2 border-gray-400 dark:border-gray-900 border-dotted mb-6 p-6"
        >
            {children}
        </motion.div>
    )
}