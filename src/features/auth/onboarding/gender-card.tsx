import React from "react";
import { motion } from "framer-motion";

interface GenderCardProps {
    type: "male" | "female";
    selected: boolean;
    onSelect: () => void;
    imageUrl: string;
}

export function GenderCard({ type, selected, onSelect, imageUrl }: GenderCardProps) {
    return (
        <motion.div
            onClick={onSelect}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                selected ? "border-gray-300 shadow-glow" : "border-zinc-800 hover:border-zinc-600"
            }`}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="aspect-square relative">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center">
        <span
            className={`text-lg font-medium transition-all duration-300 ${
                selected ? "text-white" : "text-zinc-400 group-hover:text-white"
            }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
            </div>
            {selected && (
                <motion.div
                    className="absolute top-3 right-3 h-6 w-6 rounded-full bg-white flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-black"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </motion.div>
            )}
        </motion.div>
    );
}