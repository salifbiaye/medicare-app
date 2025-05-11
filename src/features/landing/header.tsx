"use client"
import Link from "next/link"
import { Menu, Syringe, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import { useScroll, motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

const menuItems = [
  { name: "Fonctionnalités", href: "#teleconsultation", submenu: [
      { name: "Téléconsultation", href: "#teleconsultation" },
      { name: "Téléradiologie", href: "#teleradiologie" },

    ] },

  { name: "Securité", href: "#security" },
  { name: "Rejoignez nous", href: "#join-us" },
]

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [hoveredMenu, setHoveredMenu] = React.useState(null)
  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
      <header>
        <nav
            data-state={menuState && "active"}
            className="fixed z-70 w-full pt-2"
        >
          <div
              className={cn(
                  "mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12",
                  scrolled
                      ? "bg-white/80 dark:bg-muted/80 backdrop-blur-xl shadow-lg"
                      : "bg-transparent"
              )}
          >
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                    "relative flex flex-wrap items-center justify-between gap-6 py-3 duration-300 lg:gap-0 lg:py-6",
                    scrolled && "lg:py-4",
                )}
            >
              <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                <Link href="/" aria-label="home" className="group flex items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-[40px] p-3 space-x-2 transition-all duration-300 hover:shadow-md">
                  <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Syringe className="text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <span className="text-gray-800 dark:text-white font-bold bg-primary dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 transition-all duration-300">Medicare</span>
                </Link>

                <div className="flex items-center gap-4">
                  <div className="hidden lg:block">
                    <ModeToggle />
                  </div>

                  <button
                      onClick={() => setMenuState(!menuState)}
                      aria-label={menuState ? "Close Menu" : "Open Menu"}
                      className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                  >
                    <Menu className={cn(
                        "m-auto size-6 transition-all duration-300",
                        menuState ? "rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    )} />
                    <X className={cn(
                        "absolute inset-0 m-auto size-6 transition-all duration-300",
                        menuState ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"
                    )} />
                  </button>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <ul className="flex gap-4 text-sm">
                  {menuItems.map((item, index) => (
                      <li key={index} className="relative"
                          onMouseEnter={() => setHoveredMenu(item.submenu ? index : null)}
                          onMouseLeave={() => setHoveredMenu(null)}>
                        <Link
                            href={item.href}
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-medium duration-150 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-muted/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                        >
                          <span>{item.name}</span>
                          {item.submenu && <ChevronDown size={14} className={cn("transition-transform duration-150", hoveredMenu === index && "rotate-180")} />}
                        </Link>

                        {item.submenu && (
                            <AnimatePresence>
                              {hoveredMenu === index && (
                                  <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white dark:bg-muted p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                                  >
                                    <div className="py-1">
                                      {item.submenu.map((subItem, subIndex) => (
                                          <Link
                                              key={subIndex}
                                              href={subItem.href}
                                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                          >
                                            {subItem.name}
                                          </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                              )}
                            </AnimatePresence>
                        )}
                      </li>
                  ))}
                </ul>
              </div>

              {/* Mobile & Desktop Authentication Buttons */}
              <AnimatePresence>
                {menuState && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-white dark:bg-muted fixed left-0 right-0 top-[72px] border-t border-gray-100 dark:border-gray-800 p-6 shadow-2xl shadow-zinc-300/20 dark:shadow-none overflow-hidden"
                    >
                      <div className="space-y-6">
                        <ul className="space-y-4 text-base">
                          {menuItems.map((item, index) => (
                              <li key={index}>
                                <Link
                                    href={item.href}
                                    className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 block py-2 px-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-muted"
                                    onClick={() => setMenuState(false)}
                                >
                                  {item.name}
                                </Link>
                                {item.submenu && (
                                    <ul className="pl-4 mt-2 space-y-2">
                                      {item.submenu.map((subItem, subIndex) => (
                                          <li key={subIndex}>
                                            <Link
                                                href={subItem.href}
                                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm block py-1 px-3 ml-2 border-l-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                                                onClick={() => setMenuState(false)}
                                            >
                                              {subItem.name}
                                            </Link>
                                          </li>
                                      ))}
                                    </ul>
                                )}
                              </li>
                          ))}
                        </ul>
                        <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <Button variant="outline" size="lg" className="rounded-[40px] dark:text-white dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white">
                            <Link href="/login" className="w-full">
                              <span>Se connecter</span>
                            </Link>
                          </Button>
                          <Button size="lg" className="rounded-[40px] bg-primary hover:from-blue-700 hover:to-purple-700 border-0 text-white">
                            <Link href="/register" className="w-full">
                              <span>S'inscrire</span>
                            </Link>
                          </Button>
                          <div className="flex items-center justify-center pt-2">
                            <ModeToggle />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop Authentication Buttons */}
              <div className="hidden lg:flex items-center gap-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                >
                  <Button asChild variant="outline" size="lg" className="rounded-[40px] border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:hover:border-gray-600">
                    <Link href="/login">
                      <span>Se connecter</span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                >
                  <Button asChild size="lg" className="rounded-[40px] bg-primary hover:from-blue-700 hover:to-purple-700 border-0 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                    <Link href="/register">
                      <span>S'inscrire</span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </nav>
        {/* Progress bar at the top of the page */}
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
            style={{ scaleX: scrollYProgress }}
        />
      </header>
  )
}