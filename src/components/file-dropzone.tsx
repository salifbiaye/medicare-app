"use client"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileSpreadsheet, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileDropzoneProps {
    onFileAccepted: (file: File) => void
    isLoading?: boolean
    error?: string
    success?: string
}

export function FileDropzone({ onFileAccepted, isLoading = false, error, success }: FileDropzoneProps) {
    const [file, setFile] = useState<File | null>(null)

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const selectedFile = acceptedFiles[0]
                setFile(selectedFile)
                onFileAccepted(selectedFile)
            }
        },
        [onFileAccepted],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
            "text/csv": [".csv"],
        },
        maxFiles: 1,
        disabled: isLoading,
    })

    const resetFile = () => {
        setFile(null)
    }

    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith(".csv")) {
            return <FileText className="h-6 w-6 text-blue-500" />
        }
        return <FileSpreadsheet className="h-6 w-6 text-green-600" />
    }

    return (
        <div className="space-y-4">
            {!file ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Upload className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                        <h3 className="text-lg font-medium">
                            {isDragActive ? "Déposez le fichier ici" : "Glissez-déposez votre fichier"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Déposez un fichier Excel (.xlsx, .xls) ou CSV (.csv) contenant vos données à importer
                        </p>
                        <Button type="button" variant="outline" disabled={isLoading}>
                            Sélectionner un fichier
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {getFileIcon(file.name)}
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        {!isLoading && (
                            <Button variant="ghost" size="sm" onClick={resetFile} className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Supprimer</span>
                            </Button>
                        )}
                    </div>

                    {isLoading && (
                        <div className="mt-4 space-y-2">
                            <Progress value={100} className="animate-pulse" />
                            <p className="text-sm text-muted-foreground text-center">Importation en cours...</p>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
