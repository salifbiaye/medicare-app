"use client"

import * as React from "react"
import { getPersonnelStatsAction } from "@/actions/user.action"
import { Users, UserPlus, Stethoscope, UserCog, UserCheck, UserRound, Shield, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function PersonnelStats() {
    const [stats, setStats] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [activeIndex, setActiveIndex] = React.useState(0)

    React.useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)
            try {
                const result = await getPersonnelStatsAction()
                if (result.success && result.data) {
                    setStats(result.data)
                }
            } catch (error) {
                console.error("Erreur lors du chargement des statistiques:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    const statItems = [
        {
            title: "Total Personnel",
            value: stats?.totalPersonnel || 0,
            icon: Users,
            color: "accent",
            bgClass: "bg-purple-100 dark:bg-purple-900/20",
            iconClass: "bg-purple-500 text-white",
            textClass: "text-purple-700 dark:text-purple-300",
            borderClass: "border-purple-300 dark:border-purple-700",
            size: "lg",
        },
        {
            title: "Médecins",
            value: stats?.totalDoctors || 0,
            icon: Stethoscope,
            color: "success",
            bgClass: "bg-green-100 dark:bg-green-900/20",
            iconClass: "bg-green-500 text-white",
            textClass: "text-green-700 dark:text-green-300",
            borderClass: "border-green-300 dark:border-green-700",
            size: "md",
        },

        {
            title: "Médecins en Chef",
            value: stats?.totalChiefDoctors || 0,
            icon: UserCog,
            color: "destructive",
            bgClass: "bg-red-100 dark:bg-red-900/20",
            iconClass: "bg-red-500 text-white",
            textClass: "text-red-700 dark:text-red-300",
            borderClass: "border-red-300 dark:border-red-700",
            size: "md",
        },
        {
            title: "Secrétaires",
            value: stats?.totalSecretaries || 0,
            icon: UserCheck,
            color: "warning",
            bgClass: "bg-amber-100 dark:bg-amber-900/20",
            iconClass: "bg-amber-500 text-white",
            textClass: "text-amber-700 dark:text-amber-300",
            borderClass: "border-amber-300 dark:border-amber-700",
            size: "sm",
        },


    ]

    // Function to get size classes
    const getSizeClasses = (size: string) => {
        switch (size) {
            case "lg":
                return "col-span-2 row-span-2"
            case "md":
                return "col-span-1 row-span-2"
            default:
                return "col-span-1 row-span-1"
        }
    }

    if (isLoading) {
        return (
            <div className="relative h-[500px] w-full">
                <Skeleton className="absolute inset-0 rounded-xl" />
            </div>
        )
    }

    // For mobile view
    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % statItems.length)
    }

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + statItems.length) % statItems.length)
    }

    return (
        <>
            {/* Desktop view - Creative layout */}
            <div className="hidden md:block relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 rounded-2xl blur-xl opacity-50"></div>

                <div className="relative grid grid-cols-4 grid-rows-3 gap-4 h-[500px]">
                    {/* Connecting lines */}
                    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M150,100 C200,50 300,50 350,100" stroke="rgba(147, 51, 234, 0.2)" strokeWidth="2" fill="none" />
                        <path d="M350,100 C400,150 400,250 350,300" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" fill="none" />
                        <path d="M350,300 C300,350 200,350 150,300" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="2" fill="none" />
                        <path d="M150,300 C100,250 100,150 150,100" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="2" fill="none" />
                        <path d="M150,100 C200,150 300,150 350,100" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="2" fill="none" />
                        <path d="M150,300 C200,250 300,250 350,300" stroke="rgba(107, 114, 128, 0.2)" strokeWidth="2" fill="none" />
                    </svg>

                    {statItems.map((item, index) => {
                        const sizeClass = getSizeClasses(item.size)

                        // Calculate positions based on index for a more creative layout
                        let gridColumn = ""
                        let gridRow = ""

                        switch (index) {
                            case 0:
                                gridColumn = "2 / span 2"
                                gridRow = "1 / span 2"
                                break
                            case 1:
                                gridColumn = "1 / span 1"
                                gridRow = "1 / span 2"
                                break
                            case 2:
                                gridColumn = "4 / span 1"
                                gridRow = "1 / span 2"
                                break
                            case 3:
                                gridColumn = "1 / span 4"
                                gridRow = "3 / span 4"
                                break


                            default:
                                break
                        }

                        return (
                            <div
                                key={index}
                                className={`relative overflow-hidden ${item.bgClass} rounded-xl backdrop-blur-sm border ${item.borderClass} shadow-lg hover:shadow-xl transition-all duration-300`}
                                style={{ gridColumn, gridRow }}
                            >
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white dark:bg-gray-700"></div>
                                    <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white dark:bg-gray-700"></div>
                                </div>

                                <div className="relative h-full p-4 flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</h3>
                                        <div className={`${item.iconClass} p-2 rounded-lg shadow-md`}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <p className={`text-3xl font-bold ${item.textClass}`}>{item.value.toLocaleString()}</p>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.iconClass}`}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Mobile view - Interactive carousel */}
            <div className="md:hidden">
                <div className="relative overflow-hidden rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handlePrev}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                            <ChevronRight className="h-5 w-5 rotate-180" />
                        </button>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {activeIndex + 1} / {statItems.length}
                        </div>
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="relative h-[200px] overflow-hidden rounded-xl">
                        {statItems.map((item, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 ${item.bgClass} rounded-xl backdrop-blur-sm border ${item.borderClass} shadow-lg transition-all duration-500 ${
                                    index === activeIndex ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                                }`}
                            >
                                <div className="relative h-full p-6 flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</h3>
                                        <div className={`${item.iconClass} p-3 rounded-xl shadow-lg`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <p className={`text-4xl font-bold ${item.textClass}`}>{item.value.toLocaleString()}</p>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.iconClass}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Indicator dots */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {statItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`h-2 w-2 rounded-full transition-all ${
                                    index === activeIndex ? "bg-purple-500 w-4" : "bg-gray-300 dark:bg-gray-700"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
} 