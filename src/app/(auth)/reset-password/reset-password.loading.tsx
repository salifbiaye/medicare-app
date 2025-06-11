import {ArrowLeft, Syringe} from "lucide-react";
import Link from "next/link";
import {ModeToggle} from "@/components/mode-toggle";

export function ResetPasswordLoading() {
    return (
        <div className="login-container flex min-h-screen overflow-hidden">
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8">
                <div className="absolute top-4 left-4 w-full flex justify-between pt-2 p-8 ">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4"/>
                        Retour à l'accueil
                    </Link>
                    <ModeToggle/>
                </div>
                <div className="max-w-md w-full">
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex items-center gap-2 font-bold text-2xl mb-4">
                            <Syringe className="h-7 w-7 text-primary"/>
                            <span className="text-gray-800 dark:text-white">Medicare</span>
                        </div>
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-64"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-80"></div>
                        </div>
                    </div>
                    <div className="animate-pulse space-y-4">
                        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}