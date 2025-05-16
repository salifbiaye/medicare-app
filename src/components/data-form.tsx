"use client"

import React from "react"
import { Control, FieldValues, Path, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z, ZodType } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {Save, ArrowLeft, Loader2, CheckCircle2, X, ArrowRight, Palette, Users} from "lucide-react"
import { CustomFormMail } from "@/components/input-component/mail-input"
import { CustomFormPassword } from "@/components/input-component/password-input"
import { CustomFormText } from "@/components/input-component/text-input"
import { CustomFormOtp } from "@/components/input-component/otp-input"
import Link from "next/link"
import { CustomFormCheckbox } from "@/components/input-component/check-box-input"
import { CustomFormSelect } from "@/components/input-component/select-input"
import { CustomFormMultiSelect } from "@/components/input-component/multi-select-input"
import { CustomFormSlider } from "@/components/input-component/slide-input"
import { CustomFormFileUpload } from "@/components/input-component/file-input"
import { CustomFormNumberInput } from "@/components/input-component/number-input"
import { CustomFormDatePicker } from "@/components/input-component/date-input"
import { CustomFormTextarea } from "@/components/input-component/text-area-input"
import { motion } from "framer-motion"
import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";

// Type utilitaire
type InferFormValues<T extends ZodType<any, any, any>> = z.infer<T>

// Types de champs supportés
type FieldType = "email" | "password" | "text" | "textarea" | "select" | "checkbox" | "date" | "number" | "otp" | "file" | "slide" | "multi-select"

// Configuration pour les options des champs select, radio, etc.
interface FieldOption {
    value: string
    label: string
}

// Groupes de champs pour les mises en page avancées
interface FieldGroup {
    title?: string
    description?: string
    fields: string[] // Noms des champs dans ce groupe
    collapsible?: boolean
    collapsed?: boolean
    icon?: React.ReactNode
    variant?: "default" | "outlined" | "filled"
}

interface FieldConfig<T extends FieldValues> {
    type: FieldType
    name: Path<T>
    label: string
    placeholder?: string
    required?: boolean
    options?: FieldOption[] // Pour les champs select, radio, etc.
    disabled?: boolean
    defaultValue?: any
    width?: "full" | "half" | "third" | "quarter" // Pour le layout responsive
    helpText?: string
    hidden?: boolean
    min?: number
    max?: number
    step?: number
    rows?: number
    icon?: React.ReactNode
    tooltip?: string
    loadOptions?: (formData?: any) => Promise<FieldOption[]>
    dependsOn?: string // Nom du champ dont dépend ce champ
    validation?: {
        min?: number
        max?: number
        minLength?: number
        maxLength?: number
        pattern?: RegExp
        message?: string
    }
}

interface DataFormProps<T extends ZodType<any, any, any>> {
    schema: T
    fields: FieldConfig<InferFormValues<T>>[]
    submitButtonText: string
    isLoading?: boolean
    onSubmit: (values: InferFormValues<T>) => void
    initialData?: Partial<InferFormValues<T>>
    backLink?: {
        text: string
        href: string
    }
    title?: string
    description?: string
    layout?: "standard" | "sidebar" | "columns" | "grid" | "card" | "steps" | "tabs" | "wizard"
    theme?: "modern" | "minimal" | "glassmorphism" | "neumorphism" | "gradient"
    groups?: FieldGroup[]
    iconHeader?: React.ReactNode
    sidebarContent?: React.ReactNode
    showProgressBar?: boolean
    accentColor?: string // Pour personnaliser la couleur principale
    rounded?: "none" | "sm" | "md" | "lg" | "full" // Pour contrôler les coins arrondis
    elevation?: "none" | "sm" | "md" | "lg" | "xl" // Pour contrôler l'ombre portée
    headerImage?: string // URL d'une image pour l'en-tête
    className?: string
    animation?: "fade" | "slide" | "zoom" | "bounce" | "none"
}

// Animations pour framer-motion
const animations = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 }
    },
    slide: {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 },
        transition: { duration: 0.5 }
    },
    zoom: {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        transition: { duration: 0.5 }
    },
    bounce: {
        initial: { y: -20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 20, opacity: 0 },
        transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    none: {}
}

export function DataForm<T extends ZodType<any, any, any>>({
                                                               schema,
                                                               fields,
                                                               submitButtonText,
                                                               isLoading = false,
                                                               onSubmit,
                                                               initialData = {},
                                                               backLink,
                                                               iconHeader,
                                                               title,
                                                               description,
                                                               layout = "standard",
                                                               theme = "modern",
                                                               groups,
                                                               sidebarContent,
                                                               showProgressBar = false,
                                                               accentColor,
                                                               rounded = "md",
                                                               elevation = "md",
                                                               headerImage,
                                                               className = "",
                                                               animation = "fade"
                                                           }: DataFormProps<T>) {
    type FormValues = InferFormValues<T>

    const [activeStep, setActiveStep] = React.useState(0)
    const [activeTab, setActiveTab] = React.useState(0)
    const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({})

    // Préparer les valeurs par défaut en combinant les valeurs initiales et les défauts des champs
    const defaultValues = React.useMemo(() => {
        const fieldDefaults = fields.reduce((acc, field) => {
            return { ...acc, [field.name]: field.defaultValue || "" }
        }, {} as Partial<FormValues>)

        return { ...fieldDefaults, ...initialData }
    }, [fields, initialData])

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as FormValues,
    })

    const handleSubmit = form.handleSubmit((values) => {
        onSubmit(values)
    })

    // Gérer les étapes pour le layout wizard/steps
    const totalSteps = groups?.length || 1
    const handleNextStep = () => {
        if (activeStep < totalSteps - 1) setActiveStep(activeStep + 1)
    }
    const handlePrevStep = () => {
        if (activeStep > 0) setActiveStep(activeStep - 1)
    }

    // Basculer l'état des groupes pliables
    const toggleGroup = (index: number) => {
        setCollapsedGroups({
            ...collapsedGroups,
            [index]: !collapsedGroups[index]
        })
    }

    const renderField = (field: FieldConfig<FormValues>) => {
        if (field.hidden) return null

        const commonProps = {
            name: field.name,
            control: form.control as Control<FormValues>,
            labelText: field.label,
            placeholder: field.placeholder || `Entrez ${field.label.toLowerCase()}`,
            disabled: field.disabled,
        }

        switch (field.type) {
            case "email":
                return <CustomFormMail {...commonProps} />
            case "password":
                return <CustomFormPassword {...commonProps} />
            case "text":
                return <CustomFormText {...commonProps} />
            case "textarea":
                return <CustomFormTextarea {...commonProps} rows={field.rows || 4} />
            case "select":
                return <CustomFormSelect 
                    {...commonProps} 
                    options={field.options || []} 
                    loadOptions={field.loadOptions}
                    dependsOn={field.dependsOn}
                />
            case "multi-select":
                return <CustomFormMultiSelect 
                    {...commonProps} 
                    options={field.options || []} 
                    loadOptions={field.loadOptions}
                    dependsOn={field.dependsOn}
                />
            case "checkbox":
                return <CustomFormCheckbox {...commonProps} />
            case "date":
                return <CustomFormDatePicker {...commonProps} />
            case "number":
                return <CustomFormNumberInput
                    {...commonProps}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                />
            case "file":
                return <CustomFormFileUpload {...commonProps} />
            case "slide":
                return <CustomFormSlider
                    {...commonProps}
                    min={field.min || 0}
                    max={field.max || 100}
                    step={field.step || 1}
                />
            case "otp":
                return <CustomFormOtp {...commonProps} />
            default:
                return <CustomFormText {...commonProps} />
        }
    }

    const getFieldWidth = (width?: "full" | "half" | "third" | "quarter") => {
        switch (width) {
            case "quarter":
                return "col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-1"
            case "third":
                return "col-span-1 sm:col-span-1 lg:col-span-1"
            case "half":
                return "col-span-1 sm:col-span-1"
            case "full":
            default:
                return "col-span-1 sm:col-span-2"
        }
    }

    // Classes pour les différents thèmes
    const themeClasses = React.useMemo(() => {
        const baseClasses = "transition-all duration-300"
        const roundedClasses = {
            none: "rounded-none",
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full"
        }

        const elevationClasses = {
            none: "",
            sm: "shadow-sm",
            md: "shadow-md",
            lg: "shadow-lg",
            xl: "shadow-xl"
        }

        switch (theme) {
            case "minimal":
                return `${baseClasses} bg-transparent border-none ${roundedClasses[rounded]}`
            case "glassmorphism":
                return `${baseClasses} bg-background/80 backdrop-blur-md border border-border/30 ${roundedClasses[rounded]} ${elevationClasses[elevation]}`
            case "neumorphism":
                return `${baseClasses} bg-background border-none ${roundedClasses[rounded]} shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.7)]`
            case "gradient":
                return `${baseClasses} bg-gradient-to-br from-background to-muted border-none ${roundedClasses[rounded]} ${elevationClasses[elevation]}`
            case "modern":
            default:
                return `${baseClasses} bg-card border border-border ${roundedClasses[rounded]} ${elevationClasses[elevation]}`
        }
    }, [theme, rounded, elevation])

    // Classes pour les boutons selon le theme
    const buttonClasses = React.useMemo(() => {
        const baseClasses = "flex items-center justify-center transition-all duration-300"

        switch (theme) {
            case "minimal":
                return `${baseClasses} bg-primary hover:bg-primary/90 text-primary-foreground rounded-md`
            case "glassmorphism":
                return `${baseClasses} bg-primary/80 hover:bg-primary/90 backdrop-blur-sm text-primary-foreground ${rounded === "full" ? "rounded-full" : "rounded-md"}`
            case "neumorphism":
                return `${baseClasses} bg-background text-foreground shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] ${rounded === "full" ? "rounded-full" : "rounded-md"}`
            case "gradient":
                return `${baseClasses} bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground ${rounded === "full" ? "rounded-full" : "rounded-md"}`
            case "modern":
            default:
                return `${baseClasses} bg-primary hover:bg-primary/90 text-primary-foreground ${rounded === "full" ? "rounded-full" : "rounded-md"}`
        }
    }, [theme, rounded])

    // Classes pour les différents layouts
    const layoutClasses = {
        standard: "space-y-6",
        sidebar: "grid grid-cols-1 md:grid-cols-3 gap-6",
        columns: "grid grid-cols-1 sm:grid-cols-2 gap-6",
        grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        card: "grid grid-cols-1 md:grid-cols-2 gap-8",
        steps: "space-y-6",
        tabs: "space-y-6",
        wizard: "space-y-6"
    }

    // Récupérer les champs à afficher selon le layout
    const getVisibleFields = () => {
        if (!groups) return fields

        if (layout === "steps" || layout === "wizard") {
            return fields.filter(field =>
                groups[activeStep]?.fields.includes(field.name as string)
            )
        }

        if (layout === "tabs") {
            return fields.filter(field =>
                groups[activeTab]?.fields.includes(field.name as string)
            )
        }

        return fields
    }

    // Rendu du formulaire avec animation
    const FormContainer = ({ children }: { children: React.ReactNode }) => {
        if (animation === "none") return <>{children}</>

        return (
            <motion.div

                initial={animations[animation].initial}
                animate={animations[animation].animate}
                exit={animations[animation].exit}
                transition={animations[animation].transition}
            >
                {children}
            </motion.div>
        )
    }

    // Rendu des onglets pour le layout "tabs"
    const renderTabs = () => {
        if (!groups || layout !== "tabs") return null

        return (
            <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
                {groups.map((group, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                            activeTab === index
                                ? "border-b-2 border-primary text-foreground"
                                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {group.icon && <span className="mr-2">{group.icon}</span>}
                        {group.title || `Étape ${index + 1}`}
                    </button>
                ))}
            </div>
        )
    }

    // Rendu de la barre de progression pour layouts "steps" et "wizard"
    const renderProgressBar = () => {
        if (!showProgressBar || !groups || !["steps", "wizard"].includes(layout)) return null

        return (
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {groups.map((group, index) => (
                        <div
                            key={index}
                            className={`text-sm font-medium cursor-pointer ${
                                index <= activeStep ? "text-primary" : "text-muted-foreground"
                            }`}
                            onClick={() => setActiveStep(index)}
                        >
                            {group.title || `Étape ${index + 1}`}
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}
                    />
                </div>
            </div>
        )
    }

    // Rendu des groupes de champs
    const renderFieldGroups = () => {
        if (!groups) {
            // Si pas de groupes définis, afficher tous les champs
            return (
                <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-6"}>
                    {getVisibleFields().map((field) => (
                        <div
                            key={field.name as string}
                            className={`space-y-2 form-field ${
                                ["columns", "grid"].includes(layout) ? getFieldWidth(field.width) : ""
                            }`}
                        >
                            {renderField(field)}
                            {field.helpText && (
                                <p className="text-xs text-muted-foreground">{field.helpText}</p>
                            )}
                        </div>
                    ))}
                </div>
            )
        }

        if (layout === "steps" || layout === "wizard") {
            const currentGroup = groups[activeStep]

            return (
                <div className="space-y-6 bg-gray-200/40 border border-border dark:bg-muted p-8  rounded-lg">


                    <div className="space-y-6">
                        {getVisibleFields().map((field) => (
                            <div
                                key={field.name as string}
                                className="space-y-2 form-field"
                            >
                                {renderField(field)}
                                {field.helpText && (
                                    <p className="text-xs text-muted-foreground">{field.helpText}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        if (layout === "tabs") {
            const currentGroup = groups[activeTab]

            return (
                <div className="space-y-6">
                    {currentGroup?.title && (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">{currentGroup.title}</h3>
                            {currentGroup.description && (
                                <p className="text-sm text-muted-foreground">{currentGroup.description}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-6">
                        {getVisibleFields().map((field) => (
                            <div
                                key={field.name as string}
                                className="space-y-2 form-field"
                            >
                                {renderField(field)}
                                {field.helpText && (
                                    <p className="text-xs text-muted-foreground">{field.helpText}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        // Pour les autres layouts, afficher les groupes
        return (
            <div className="space-y-8">
                {groups.map((group, groupIndex) => {
                    const isCollapsed = group.collapsible && collapsedGroups[groupIndex]
                    const groupFields = fields.filter(field =>
                        group.fields.includes(field.name as string)
                    )

                    return (
                        <div
                            key={groupIndex}
                            className={`${themeClasses} p-4 ${group.variant === "outlined" ? "border border-border" : group.variant === "filled" ? "bg-muted" : ""}`}
                        >
                            {group.title && (
                                <div
                                    className={`flex items-center justify-between mb-4 ${group.collapsible ? "cursor-pointer" : ""}`}
                                    onClick={() => group.collapsible ? toggleGroup(groupIndex) : null}
                                >
                                    <div className="flex items-center space-x-2">
                                        {group.icon && <span>{group.icon}</span>}
                                        <h3 className="text-lg font-medium">{group.title}</h3>
                                    </div>

                                    {group.collapsible && (
                                        <button type="button" className="text-muted-foreground">
                                            {isCollapsed ? <ArrowRight size={18} /> : <X size={18} />}
                                        </button>
                                    )}
                                </div>
                            )}

                            {group.description && !isCollapsed && (
                                <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                            )}

                            {!isCollapsed && (
                                <div className={`${layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}`}>
                                    {groupFields.map((field) => (
                                        <div
                                            key={field.name as string}
                                            className={`space-y-2 form-field ${
                                                ["columns", "grid"].includes(layout) ? getFieldWidth(field.width) : ""
                                            }`}
                                        >
                                            {renderField(field)}
                                            {field.helpText && (
                                                <p className="text-xs text-muted-foreground">{field.helpText}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    // Rendu des boutons pour steps/wizard
    const renderStepButtons = () => {
        if (!["steps", "wizard"].includes(layout) || !groups) return null

        return (
            <div className="flex justify-between mt-8">
                <Button
                    type="button"
                    variant="outline"
                    className={`${buttonClasses} px-4 py-2`}
                    onClick={handlePrevStep}
                    disabled={activeStep === 0}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                </Button>

                {activeStep < totalSteps - 1 ? (
                    <Button
                        type="button"
                        className={`${buttonClasses} px-4 py-2`}
                        onClick={handleNextStep}
                    >
                        Suivant
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className={`${buttonClasses} px-4 py-2`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Chargement...
                            </>
                        ) : (
                            <span className="flex items-center justify-center">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {submitButtonText}
              </span>
                        )}
                    </Button>
                )}
            </div>
        )
    }

    // Classes pour le conteneur du form selon le layout
    const formContainerClasses = layout === "sidebar" ? "md:col-span-2" : ""

    // Style personnalisé pour la couleur d'accent si définie
    const customStyle = accentColor ? {
        "--accent-color": accentColor,
        "--ring-color": `${accentColor}50`,
    } as React.CSSProperties : {}

    return (
        <div className={`w-full p-6 ${className}`} style={customStyle}>
            {(title || description || backLink || headerImage) && (
                <div className="mb-8">
                    {headerImage && (
                        <div className={` aspect-video border border-border mb-6 overflow-hidden ${
                            rounded === "full" ? "rounded-md" : `rounded-${rounded}`
                        }`}>
                            <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
                        </div>
                    )}



                    {title && (

                        <AnimatedLayout>
                        <ParticlesBackground />

                        <AnimatedHeader>
                        <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
                            {iconHeader}
                        </div>
                            <div >
                                <motion.h1
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.5}}
                                    className="text-2xl text-background dark:text-foreground d font-bold mb-2"
                                >
                                    {title}
                                </motion.h1>
                                <p className={"text-background/80 dark:text-foreground/40"}>
                                    {description}
                                </p>
                            </div>
                        </AnimatedHeader>

                        </AnimatedLayout>
                    )}
                    {backLink && (
                        <Link
                            href={backLink.href}
                            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {backLink.text}
                        </Link>
                    )}

                </div>
            )}

            <Form {...form}>
                <form  onSubmit={handleSubmit} className={layoutClasses[layout]}>
                    {layout === "sidebar" && (
                        <div className="space-y-4">
                            {sidebarContent || (
                                <div className={`${themeClasses} p-4`}>
                                    <div className="flex items-center mb-4">
                                        <Palette className="h-5 w-5 mr-2 text-primary" />
                                        <h3 className="font-medium">Informations</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`space-y-6 ${formContainerClasses}`}>
                        {/* Affichage des onglets pour layout "tabs" */}
                        {renderTabs()}

                        {/* Barre de progression pour steps/wizard */}
                        {renderProgressBar()}

                        <FormContainer>
                            {/* Contenu principal du formulaire */}
                            {layout === "card" ? (
                                <div className={`${themeClasses} p-6`}>
                                    {renderFieldGroups()}
                                </div>
                            ) : (
                                renderFieldGroups()
                            )}

                            {/* Boutons pour steps/wizard */}
                            {renderStepButtons()}

                            {/* Bouton de soumission standard (sauf pour steps/wizard) */}
                            {!["steps", "wizard"].includes(layout) && (
                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        className={`${buttonClasses} h-12 px-6`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Chargement...
                                            </>
                                        ) : (
                                            <span className="flex items-center justify-center">
                        <Save className="mr-2 h-5 w-5" />
                                                {submitButtonText}
                      </span>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </FormContainer>
                    </div>
                </form>
            </Form>
        </div>
    )
}