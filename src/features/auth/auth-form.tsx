// AuthForm.tsx
"use client"

import React from "react"
import {Control, FieldValues, Path, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z, ZodType} from "zod"
import {Button} from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import {ArrowRight, Loader2} from "lucide-react"
import Link from "next/link"
import {CustomFormMail} from "@/components/input-component/mail-input"
import {CustomFormPassword} from "@/components/input-component/password-input"
import {CustomFormText} from "@/components/input-component/text-input"

// Type utilitaire
type InferFormValues<T extends ZodType<any, any, any>> = z.infer<T>

interface FieldConfig<T extends FieldValues> {
    type: "email" | "password" | "text"
    name: Path<T>
    label: string
    placeholder: string
    required?: boolean
}

interface AuthFormProps<T extends ZodType<any, any, any>> {
    schema: T
    fields: FieldConfig<InferFormValues<T>>[]
    submitButtonText: string
    isLoading: boolean
    onSubmit: (values: InferFormValues<T>) => void
    footerText?: string
    footerLinkText?: string
    footerLinkHref?: string
    socialButtons?: boolean
    forgotPasswordLink?: boolean
}

export function AuthForm<T extends ZodType<any, any, any>>({
                                                               schema,
                                                               fields,
                                                               submitButtonText,
                                                               isLoading,
                                                               onSubmit,
                                                               footerText,
                                                               footerLinkText,
                                                               footerLinkHref,
                                                               socialButtons = true,
                                                               forgotPasswordLink = false,
                                                           }: AuthFormProps<T>) {
    type FormValues = InferFormValues<T>

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: fields.reduce((acc, field) => {
            return { ...acc, [field.name]: "" }
        }, {} as FormValues),
    })

    const handleSubmit = form.handleSubmit((values) => {
        onSubmit(values)
    })

    const renderField = (field: FieldConfig<FormValues>) => {
        const commonProps = {
            name: field.name,
            control: form.control as Control<FormValues>,
            labelText: field.label,
            placeholder: field.placeholder,
        }

        switch (field.type) {
            case "email":
                return <CustomFormMail {...commonProps} />
            case "password":
                return <CustomFormPassword {...commonProps} />
            case "text":
                return <CustomFormText {...commonProps} />
            default:
                return field.type
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {fields.map((field) => (
                    <div key={field.name as string} className="space-y-2 form-field">
                        {renderField(field)}

                        {field.type === "password" && forgotPasswordLink && (
                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-300"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        )}
                    </div>
                ))}

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white h-12 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-button"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Chargement...
                        </>
                    ) : (
                        <span className="flex items-center justify-center">
                            {submitButtonText}
                            <ArrowRight className="ml-2 h-5 w-5 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    )}
                </Button>

                {socialButtons && (
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-black text-zinc-400">Ou continuer avec</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 social-buttons">
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full border-zinc-800 hover:bg-zinc-900 transition-all duration-300 h-12 rounded-lg group"
                            >
                                <svg
                                    className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="transition-transform duration-300 group-hover:translate-x-1">Google</span>
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full border-zinc-800 hover:bg-zinc-900 transition-all duration-300 h-12 rounded-lg group"
                            >
                                <svg
                                    className="mr-2 h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span className="transition-transform duration-300 group-hover:translate-x-1">GitHub</span>
                            </Button>
                        </div>
                    </div>
                )}

                {footerText && footerLinkText && footerLinkHref && (
                    <div className="mt-10 text-center">
                        <p className="text-sm text-zinc-400">
                            {footerText}{" "}
                            <Link
                                href={footerLinkHref}
                                className="text-gray-500 hover:text-gray-300 transition-colors duration-300 relative inline-block group"
                            >
                                <span>{footerLinkText}</span>
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </p>
                    </div>
                )}
            </form>
        </Form>
    )
}