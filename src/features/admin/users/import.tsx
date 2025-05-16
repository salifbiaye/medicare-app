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

import {
    UserImport,
    getImportSchemaByRole,
    PatientImport,
    DirectorImport,
    SecretaryImport,
    DoctorImport
} from "@/schemas/user.schema";
import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";
import { RoleSelector } from "./role-selector";
import {importPatientsAction} from "@/actions/patient.action";
import {importDoctorsAction} from "@/actions/doctor.action";
import {importDirectorsAction} from "@/actions/director.action";
import {importSecretariesAction} from "@/actions/secretary.action";

type Role = "PATIENT" | "DOCTOR" | "CHIEF_DOCTOR" | "SECRETARY" | "DIRECTOR" | "ADMIN";

const userImportHeadersByRole: Record<string, string[]> = {
    PATIENT: ["name", "email", "gender", "role", "emailVerified", "profileCompleted", "socialSecurityNumber", "bloodGroup", "allergies"],
    DOCTOR: ["name", "email", "gender", "role", "emailVerified", "profileCompleted", "specialty", "registrationNumber", "isChief", "hospitalId", "serviceId"],
    CHIEF_DOCTOR: ["name", "email", "gender", "role", "emailVerified", "profileCompleted", "specialty", "registrationNumber", "isChief", "hospitalId", "serviceId"],
    SECRETARY: ["name", "email", "gender", "role", "emailVerified", "profileCompleted", "hospitalId", "serviceId"],
    DIRECTOR: ["name", "email", "gender", "role", "emailVerified", "profileCompleted", "hospitalId"],
    ADMIN: ["name", "email", "gender", "role", "emailVerified", "profileCompleted"],
};

export default function ImportUsersPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<Role>("PATIENT")
    const [validationResults, setValidationResults] = useState<{
        valid: PatientImport [] | DirectorImport[] | SecretaryImport[] | DoctorImport[];
        invalid: { data: any; errors: z.ZodError }[]
    } | null>(null)

    // Définition des formats acceptés par rôle (doit être dans la fonction)
    const acceptedFormatsByRole: Record<Role, { label: string; value: string }[]> = {
        PATIENT: [
            { label: "Gender", value: "MALE ou FEMALE" },
            { label: "Role", value: "PATIENT" },
            { label: "emailVerified/profileCompleted", value: "true/false, Oui/Non, Yes/No" },
            { label: "socialSecurityNumber", value: "(optionnel) Numéro de sécurité sociale" },
            { label: "bloodGroup", value: "(optionnel) A+, A-, B+, B-, AB+, AB-, O+, O-" },
            { label: "allergies", value: "(optionnel) texte libre" },
        ],
        DOCTOR: [
            { label: "Gender", value: "MALE ou FEMALE" },
            { label: "Role", value: "DOCTOR" },
            { label: "emailVerified/profileCompleted", value: "true/false, Oui/Non, Yes/No" },
            { label: "specialty", value: "GENERAL_PRACTICE, OPHTHALMOLOGY, ... (voir modèle)" },
            { label: "registrationNumber", value: "Numéro d'enregistrement (obligatoire)" },
            { label: "isChief", value: "true/false, Oui/Non, Yes/No (optionnel)" },
            { label: "hospitalId", value: "ID de l'hôpital (obligatoire)" },
            { label: "serviceId", value: "ID du service (obligatoire)" },
        ],
        CHIEF_DOCTOR: [
            { label: "Gender", value: "MALE ou FEMALE" },
            { label: "Role", value: "CHIEF_DOCTOR" },
            { label: "emailVerified/profileCompleted", value: "true/false, Oui/Non, Yes/No" },
            { label: "specialty", value: "GENERAL_PRACTICE, OPHTHALMOLOGY, ... (voir modèle)" },
            { label: "registrationNumber", value: "Numéro d'enregistrement (obligatoire)" },
            { label: "isChief", value: "true/false, Oui/Non, Yes/No (optionnel)" },
            { label: "hospitalId", value: "ID de l'hôpital (obligatoire)" },
            { label: "serviceId", value: "ID du service (obligatoire)" },
        ],
        SECRETARY: [
            { label: "Gender", value: "MALE ou FEMALE" },
            { label: "Role", value: "SECRETARY" },
            { label: "emailVerified/profileCompleted", value: "true/false, Oui/Non, Yes/No" },
            { label: "hospitalId", value: "ID de l'hôpital (obligatoire)" },
            { label: "serviceId", value: "ID du service (obligatoire)" },
        ],
        DIRECTOR: [
            { label: "Gender", value: "MALE ou FEMALE" },
            { label: "Role", value: "DIRECTOR" },
            { label: "emailVerified/profileCompleted", value: "true/false, Oui/Non, Yes/No" },
            { label: "hospitalId", value: "ID de l'hôpital (obligatoire)" },
        ],
        ADMIN: [
            { label: "Gender", value: "MALE ou FEMALE" },
            { label: "Role", value: "ADMIN" },
            { label: "emailVerified/profileCompleted", value: "true/false, Oui/Non, Yes/No" },
        ],
    };

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

            // Valider les données avec le schéma du rôle sélectionné
            const schema = getImportSchemaByRole(selectedRole)
            const results = await validateImportData(data, schema)
            
            // Filtrer et typer les données selon le rôle
            let typedValid: PatientImport[] | DirectorImport[] | SecretaryImport[] | DoctorImport[];
            
            // Forcer le type des données validées
            const validData = results.valid as any[];
            
            switch (selectedRole) {
                case "PATIENT": {
                    const patientData = validData
                        .filter((u) => u.role === "PATIENT")
                        .map((u) => ({
                            ...u,
                            emailVerified: Boolean(u.emailVerified),
                            profileCompleted: Boolean(u.profileCompleted),
                            role: "PATIENT" as const,
                            socialSecurityNumber: u.socialSecurityNumber,
                            bloodGroup: u.bloodGroup,
                            allergies: u.allergies,
                        }));
                    typedValid = patientData as PatientImport[];
                    break;
                }
                case "DOCTOR":
                case "CHIEF_DOCTOR": {
                    const doctorData = validData
                        .filter((u) => u.role === selectedRole)
                        .map((u) => ({
                            ...u,
                            emailVerified: Boolean(u.emailVerified),
                            profileCompleted: Boolean(u.profileCompleted),
                            role: selectedRole,
                            specialty: u.specialty,
                            registrationNumber: u.registrationNumber,
                            hospitalId: u.hospitalId,
                            serviceId: u.serviceId,
                            isChief: Boolean(u.isChief),
                        }));
                    typedValid = doctorData as DoctorImport[];
                    break;
                }
                case "SECRETARY": {
                    const secretaryData = validData
                        .filter((u) => u.role === "SECRETARY")
                        .map((u) => ({
                            ...u,
                            emailVerified: Boolean(u.emailVerified),
                            profileCompleted: Boolean(u.profileCompleted),
                            role: "SECRETARY" as const,
                            hospitalId: u.hospitalId,
                            serviceId: u.serviceId,
                        }));
                    typedValid = secretaryData as SecretaryImport[];
                    break;
                }
                case "DIRECTOR": {
                    const directorData = validData
                        .filter((u) => u.role === "DIRECTOR")
                        .map((u) => ({
                            ...u,
                            emailVerified: Boolean(u.emailVerified),
                            profileCompleted: Boolean(u.profileCompleted),
                            role: "DIRECTOR" as const,
                            hospitalId: u.hospitalId,
                        }));
                    typedValid = directorData as DirectorImport[];
                    break;
                }
                default:
                    throw new Error("Rôle non valide");
            }

            setValidationResults({ valid: typedValid, invalid: results.invalid });

            if (results.invalid.length > 0) {
                setError(
                    `${results.invalid.length} entrée(s) contiennent des erreurs. Veuillez corriger les erreurs avant d'importer.`,
                )
            } else if (results.valid.length === 0) {
                setError(`Aucune donnée valide pour le rôle ${selectedRole}.`)
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
            let result
            switch (selectedRole) {
                case "PATIENT": {
                    const patientData = validationResults.valid as PatientImport[];
                    result = await importPatientsAction(patientData);
                    break;
                }
                case "DOCTOR":
                case "CHIEF_DOCTOR": {
                    const doctorData = validationResults.valid as DoctorImport[];
                    result = await importDoctorsAction(doctorData);
                    break;
                }
                case "SECRETARY": {
                    const secretaryData = validationResults.valid as SecretaryImport[];
                    result = await importSecretariesAction(secretaryData);
                    break;
                }
                case "DIRECTOR": {
                    const directorData = validationResults.valid as DirectorImport[];
                    result = await importDirectorsAction(directorData);
                    break;
                }
                default:
                    throw new Error("Rôle non valide")
            }
            if (result.success === "partial") {
                setError(`${result.message} ${result.data.existing} utilisateur(s) existent déjà, ${result.data.toCreate} utilisateur(s) seront importé(s).`)
                toastAlert.error({
                    title: "Erreur",
                    description: result.message
                });
            } else if (result.success === true) {
                setSuccess(`${validationResults.valid.length} utilisateur(s) importé(s) avec succès.`)
                toastAlert.success({
                    title: "Importation réussie",
                    description: `${validationResults.valid.length} utilisateur(s) ont été importés avec succès.`,
                })
            } else {
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

    // Générer le template à télécharger selon le rôle
    const templateHeaders = userImportHeadersByRole[selectedRole] || userImportHeadersByRole["PATIENT"]

    return (
        <div className=" py-10">
            <RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} />
            <AnimatedLayout>
                <ParticlesBackground/>

                <AnimatedHeader>
                    <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
                        <Users2 className="h-8 w-8 text-primary"/>
                    </div>
                    <div>
                        <h1 className="text-2xl text-background dark:text-foreground font-bold">Importer des {selectedRole.toLowerCase()}s</h1>
                        <p className="text-background/50 dark:text-muted-foreground mt-1">
                            Importez plusieurs {selectedRole.toLowerCase()}s à partir d'un fichier Excel ou CSV
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
                    <TemplateDownloadMenu headers={templateHeaders} filename={`modele-${selectedRole.toLowerCase()}s`} />
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

                    <div className="mt-4 p-4 bg-accent dark:bg-accent/50 border border-accent rounded-md">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-primary dark:text-white mr-2 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-primary dark:text-white">Formats acceptés</h4>
                                <ul className="mt-1 text-sm text-primary dark:text-white list-disc list-inside">
                                    {acceptedFormatsByRole[selectedRole].map((item) => (
                                        <li key={item.label}>
                                            <strong>{item.label}</strong>: {item.value}
                                        </li>
                                    ))}
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
                                    {templateHeaders.map((header) => (
                                        <th key={header} className="p-2 text-left text-xs font-medium text-muted-foreground border">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {validationResults.valid.slice(0, 5).map((user, index) => (
                                    <tr key={index} className="border-b">
                                        {templateHeaders.map((header) => (
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