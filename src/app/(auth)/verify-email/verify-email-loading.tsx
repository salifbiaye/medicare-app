import {Syringe} from "lucide-react";

export function VerifyEmailLoading() {
    return (
        <div className="login-container flex min-h-screen overflow-hidden">
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex items-center gap-2 font-bold text-2xl mb-4">
                            <Syringe className="h-7 w-7 text-primary"/>
                            <span className="text-gray-800 dark:text-white">Medicare</span>
                        </div>
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-48"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}