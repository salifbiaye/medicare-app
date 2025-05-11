"use client"
import { useState } from "react"
import { z } from "zod"
import { FileDropzone } from "@/components/file-dropzone"
import { TemplateDownloadMenu } from "../../../components/datatable/template-download-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { readImportFile, validateImportData, formatValidationErrors } from "@/lib/import-utils"
import { toastAlert } from "@/components/ui/sonner-v2"
import {ArrowLeft, Upload, AlertTriangle, Users, Users2} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {createUsersAction} from "@/actions/user.action";
import {UserImport, userImportSchema} from "@/schemas/user.schema";
import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";

const userImportHeaders = ["name", "email", "gender", "role", "emailVerified", "profileCompleted"]

export default function ImportUsersPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [validationResults, setValidationResults] = useState<{
        valid: UserImport[]
        invalid: { data: any; errors: z.ZodError }[]
    } | null>(null)

    const handleFileAccepted = (file: File) => {
        setFile(file)
        setError(null)
        setSuccess(null)
        setValidationResults(null)
    }

    const handleValidate = async () => {
        if (!file) return

        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // Lire le fichier
            const data = await readImportFile(file)

            // Valider les données
            const results = await validateImportData(data, userImportSchema)
            setValidationResults(results)

            if (results.invalid.length > 0) {
                setError(
                    `${results.invalid.length} entrée(s) contiennent des erreurs. Veuillez corriger les erreurs avant d'importer.`,
                )
            } else {
                setSuccess(`${results.valid.length} utilisateur(s) prêt(s) à être importé(s).`)
            }
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleImport = async () => {
        if (!validationResults || validationResults.valid.length === 0) return

        setIsLoading(true)
        setError(null)

        try {

            const result = await createUsersAction(validationResults.valid)
            if (result.success === "partial") {
                setError(`${result.message} ${result.data.existing} utilisateur(s) existent déjà, ${result.data.toCreate} utilisateur(s) seront importé(s).`)
                toastAlert.error({
                    title:"erreur",
                    description:result.message
                });
            } else if (result.success===true) {
                setSuccess(`${validationResults.valid.length} utilisateur(s) importé(s) avec succès.`)
                toastAlert.success({
                    title: "Importation réussie",
                    description: `${validationResults.valid.length} utilisateur(s) ont été importés avec succès.`,
                })
            }else {
                setError(result.message || "Une erreur s'est produite lors de l'importation.")
                toastAlert.error({
                    title: "Erreur d'importation",
                    description: result.message || "Une erreur s'est produite lors de l'importation.",
                })
            }


            setTimeout(() => {
                router.push("/admin/users")
            }, 2000)
        } catch (err) {
            setError((err as Error).message)
            toastAlert.error({
                title: "Erreur d'importation",
                description: (err as Error).message,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container py-10">
            <AnimatedLayout>
                <ParticlesBackground/>

                <AnimatedHeader>
                    <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
                        <Users2 className="h-8 w-8 text-primary"/>
                    </div>
                    <div>
                        <h1 className="text-2xl text-background dark:text-foreground font-bold">Importer des utilisateurs</h1>
                        <p className="text-background/50 dark:text-muted-foreground mt-1">
                            Importez plusieurs utilisateurs à partir d'un fichier Excel ou CSV
                        </p>
                    </div>
                </AnimatedHeader>

            </AnimatedLayout>
            <div className="flex items-center justify-end mb-6">


                <div className="flex items-center gap-2">
                    <Link href="/admin/users">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                    <TemplateDownloadMenu headers={userImportHeaders} filename="modele-utilisateurs" />
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Instructions d'importation</CardTitle>
                    <CardDescription>Suivez ces étapes pour importer correctement vos utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Téléchargez le modèle Excel ou CSV en cliquant sur le bouton "Télécharger le modèle"</li>
                        <li>Remplissez le modèle avec vos données en respectant le format requis pour chaque colonne</li>
                        <li>Enregistrez le fichier une fois complété</li>
                        <li>Importez le fichier en le glissant-déposant dans la zone ci-dessous</li>
                        <li>Vérifiez que les données sont valides avant de finaliser l'importation</li>
                    </ol>

                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/50 border border-amber-200 rounded-md">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-white mr-2 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-amber-800 dark:text-white">Formats acceptés</h4>
                                <ul className="mt-1 text-sm text-amber-700 dark:text-white list-disc list-inside">
                                    <li>
                                        <strong>Gender</strong>: MALE ou FEMALE
                                    </li>
                                    <li>
                                        <strong>Role</strong>: PATIENT, ADMIN, DIRECTOR, DOCTOR, SECRETARY ou CHIEF_DOCTOR
                                    </li>
                                    <li>
                                        <strong>emailVerified/profileCompleted</strong>: true/false, Oui/Non, Yes/No
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Importer un fichier</CardTitle>
                    <CardDescription>
                        Glissez-déposez votre fichier Excel ou CSV contenant les données des utilisateurs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileDropzone
                        onFileAccepted={handleFileAccepted}
                        isLoading={isLoading}
                        error={error || undefined}
                        success={success || undefined}
                    />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {file && !validationResults && (
                        <Button onClick={handleValidate} disabled={isLoading}>
                            Valider les données
                        </Button>
                    )}

                    {validationResults && validationResults.valid.length > 0 && (
                        <Button onClick={handleImport} disabled={isLoading || validationResults.invalid.length > 0}>
                            <Upload className="mr-2 h-4 w-4" />
                            Importer {validationResults.valid.length} utilisateur(s)
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {validationResults && validationResults.invalid.length > 0 && (
                <Card className="mt-6 border-destructive">
                    <CardHeader className="bg-destructive/5">
                        <CardTitle className="text-destructive">Erreurs de validation</CardTitle>
                        <CardDescription>Corrigez les erreurs suivantes dans votre fichier et réessayez</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {formatValidationErrors(validationResults.invalid)}
            </pre>
                    </CardContent>
                </Card>
            )}

            {validationResults && validationResults.valid.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Aperçu des données valides</CardTitle>
                        <CardDescription>{validationResults.valid.length} utilisateur(s) prêt(s) à être importé(s)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-muted">
                                    {userImportHeaders.map((header) => (
                                        <th key={header} className="p-2 text-left text-xs font-medium text-muted-foreground border">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {validationResults.valid.slice(0, 5).map((user, index) => (
                                    <tr key={index} className="border-b">
                                        {userImportHeaders.map((header) => (
                                            <td key={`${index}-${header}`} className="p-2 text-sm border">
                                                {String(user[header as keyof UserImport])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {validationResults.valid.length > 5 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Et {validationResults.valid.length - 5} autre(s) utilisateur(s)...
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
