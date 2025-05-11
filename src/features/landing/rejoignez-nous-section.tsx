'use client'
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function RejoignezNousSection() {
  return (
      <div id={"join-us"} className="py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-50 dark:bg-blue-50/20 p-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-blue-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <span className="text-xl font-bold">
              Medicare<sup>+</sup>
            </span>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground">Rejoignez-nous dans notre Aventure</h2>

            <p className="text-gray-600 dark:text-foreground leading-relaxed">
              Rejoignez-nous dans notre mission de révolutionner les diagnostics médicaux au Sénégal et d'offrir les
              meilleurs soins possibles aux patients, même dans les zones les plus reculées du pays.
            </p>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center font-medium hover:bg-blue-700 transition-colors">
             Rejoignez-nous
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <motion.div
                className="absolute -top-2 -left-2 w-full h-full bg-background rounded-xl shadow-sm border border-border -z-10"></motion.div>
            <motion.div
                className="absolute -top-1 -left-1 w-full h-full bg-background rounded-xl shadow-sm border border-border -z-10"></motion.div>

            <motion.div
                className="bg-muted/50 rounded-xl shadow-sm border border-border overflow-hidden relative z-10 transition-colors duration-300">
              <div className="p-3 border-b border-border bg-muted/80 transition-colors duration-300">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className=" rounded-lg flex justify-center items-center w-full h-full">
                  <Image
                      src="/landing/join.png"
                      alt="join us"
                      width={800}
                      height={600}
                      className="w-full dark:hidden h-auto rounded-lg "
                  />
                  <Image
                      src="/landing/join-dark.png"
                      alt="join us"
                      width={800}
                      height={600}
                      className="w-full hidden dark:block h-auto rounded-lg "
                  />
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
  )
}
