import React from "react";
import { motion } from "framer-motion";
import { contentVariants } from "@/lib/animation-variants";

interface FeatureItemProps {
    icon: "check" | "checkCircle" | "chart" | "stats" | "clipboard" | "clock";
    title: string;
    description: string;
    custom: number;
}

export default function FeatureItem({ icon, title, description, custom }: FeatureItemProps) {
    const getIcon = () => {
        switch (icon) {
            case "check":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                );
            case "checkCircle":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                );
            case "chart":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                );
            case "stats":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                );
            case "clipboard":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                );
            case "clock":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                );
        }
    };

    return (
        <motion.div className="flex items-start gap-4 group" variants={contentVariants} custom={custom}>
            <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-gray-700 transition-colors duration-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {getIcon()}
                </svg>
            </div>
            <div>
                <h4 className="text-xl font-medium text-white mb-2">{title}</h4>
                <p className="text-zinc-400">{description}</p>
            </div>
        </motion.div>
    );
}