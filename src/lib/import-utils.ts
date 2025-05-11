import * as XLSX from "xlsx"
import { z } from "zod"

// Fonction pour lire un fichier Excel ou CSV
export async function readImportFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = e.target?.result
                if (!data) {
                    reject(new Error("Impossible de lire le fichier"))
                    return
                }

                const workbook = XLSX.read(data, { type: "array" })
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]

                // Convertir en JSON avec en-têtes
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                if (jsonData.length < 2) {
                    reject(new Error("Le fichier ne contient pas suffisamment de données"))
                    return
                }

                // Extraire les en-têtes et les données
                const headers = jsonData[0] as string[]
                const rows = jsonData.slice(1) as any[]

                // Convertir en tableau d'objets
                const result = rows.map((row) => {
                    const obj: Record<string, any> = {}
                    headers.forEach((header, index) => {
                        obj[header] = row[index]
                    })
                    return obj
                })

                resolve(result)
            } catch (error) {
                reject(new Error("Erreur lors de la lecture du fichier: " + (error as Error).message))
            }
        }

        reader.onerror = () => {
            reject(new Error("Erreur lors de la lecture du fichier"))
        }

        reader.readAsArrayBuffer(file)
    })
}

// Fonction pour valider les données importées avec un schéma Zod
export async function validateImportData<T>(
    data: any[],
    schema: z.ZodType<T>,
): Promise<{
    valid: T[]
    invalid: { data: any; errors: z.ZodError }[]
}> {
    const valid: T[] = []
    const invalid: { data: any; errors: z.ZodError }[] = []

    for (const item of data) {
        try {
            const validatedItem = schema.parse(item)
            valid.push(validatedItem)
        } catch (error) {
            if (error instanceof z.ZodError) {
                invalid.push({ data: item, errors: error })
            }
        }
    }

    return { valid, invalid }
}

// Fonction pour formater les erreurs de validation
export function formatValidationErrors(invalid: { data: any; errors: z.ZodError }[]): string {
    if (invalid.length === 0) return ""

    return (
        `${invalid.length} entrée(s) contiennent des erreurs:\n` +
        invalid
            .map((item, index) => {
                const errorMessages = item.errors.errors.map((err) => `- ${err.path.join(".")}: ${err.message}`).join("\n")

                return `Entrée ${index + 1}:\n${errorMessages}`
            })
            .join("\n\n")
    )
}
