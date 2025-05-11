import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import type { ColumnDef } from "@tanstack/react-table"

// Fonction pour obtenir la valeur d'une cellule
function getCellValue<TData, TValue>(row: TData, column: ColumnDef<TData, TValue>): string {
    // Ignorer les colonnes de sélection et d'actions
    if (column.id === "select" || column.id === "actions") {
        return ""
    }

    // Obtenir la valeur brute
    let value: any

    if ("accessorFn" in column && typeof column.accessorFn === "function") {
        value = column.accessorFn(row, 0)
    } else if ("accessorKey" in column && column.accessorKey) {
        value = (row as Record<string, any>)[column.accessorKey]
    } else if (column.id && column.id in (row as Record<string, any>)) {
        value = (row as Record<string, any>)[column.id]
    } else {
        return ""
    }

    // Traiter les types spéciaux
    if (value instanceof Date) {
        return value.toLocaleDateString()
    }

    if (typeof value === "boolean") {
        return value ? "Oui" : "Non"
    }

    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value)
    }

    return value !== undefined && value !== null ? String(value) : ""
}

// Fonction pour obtenir les en-têtes des colonnes
function getColumnHeaders<TData, TValue>(columns: ColumnDef<TData, TValue>[]): string[] {
    return columns
        .filter((column) => column.id !== "select" && column.id !== "actions")
        .map((column) => {
            if (typeof column.header === "string") {
                return column.header
            }
            return ("accessorKey" in column ? column.accessorKey : column.id) || ""
        })
}

// Fonction pour exporter les données au format CSV
export function exportToCSV<TData, TValue>(
    data: TData[],
    columns: ColumnDef<TData, TValue>[],
    filename = "export.csv",
) {
    const headers = getColumnHeaders(columns)
    const exportColumns = columns.filter((column) => column.id !== "select" && column.id !== "actions")

    const csvData = data.map((row) => {
        return exportColumns.map((column) => getCellValue(row, column))
    })

    csvData.unshift(headers)

    const csvContent = csvData
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    saveAs(blob, filename)
}

// Fonction pour exporter les données au format Excel avec un style amélioré
export function exportToExcel<TData, TValue>(
    data: TData[],
    columns: ColumnDef<TData, TValue>[],
    filename = "export.xlsx",
) {
    const headers = getColumnHeaders(columns)
    const exportColumns = columns.filter((column) => column.id !== "select" && column.id !== "actions")

    const excelData = data.map((row) => {
        return exportColumns.map((column) => getCellValue(row, column))
    })

    // Créer une feuille de calcul
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelData])

    // Définir la largeur des colonnes
    const colWidths = headers.map((header) => ({ wch: Math.max(header.length * 1.5, 10) }))
    worksheet["!cols"] = colWidths

    // Appliquer des styles aux cellules
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")

    // Style pour les en-têtes
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col })
        if (!worksheet[cellRef]) continue

        worksheet[cellRef].s = {
            fill: { fgColor: { rgb: "4F46E5" }, patternType: "solid" }, // Couleur primaire (indigo-600)
            font: { bold: true, color: { rgb: "FFFFFF" } },
            border: {
                top: { style: "thin", color: { rgb: "D1D5DB" } },
                bottom: { style: "thin", color: { rgb: "D1D5DB" } },
                left: { style: "thin", color: { rgb: "D1D5DB" } },
                right: { style: "thin", color: { rgb: "D1D5DB" } },
            },
            alignment: { horizontal: "center", vertical: "center" },
        }
    }

    // Style pour les cellules de données
    for (let row = 1; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
            if (!worksheet[cellRef]) continue

            worksheet[cellRef].s = {
                border: {
                    top: { style: "thin", color: { rgb: "E5E7EB" } },
                    bottom: { style: "thin", color: { rgb: "E5E7EB" } },
                    left: { style: "thin", color: { rgb: "E5E7EB" } },
                    right: { style: "thin", color: { rgb: "E5E7EB" } },
                },
                alignment: { vertical: "center" },
                // Alternance de couleurs pour les lignes
                fill:
                    row % 2 === 0
                        ? { fgColor: { rgb: "F9FAFB" }, patternType: "solid" } // Gris très clair
                        : { fgColor: { rgb: "FFFFFF" }, patternType: "solid" }, // Blanc
            }
        }
    }

    // Créer un classeur
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données")

    // Générer le fichier Excel avec les styles
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        bookSST: false,
        cellStyles: true,
    })

    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    saveAs(blob, filename)
}

// Fonction pour générer un modèle Excel vide basé sur le schéma
export function generateExcelTemplate(headers: string[], filename = "template.xlsx") {
    // Créer une feuille de calcul avec seulement les en-têtes
    const worksheet = XLSX.utils.aoa_to_sheet([headers])

    // Définir la largeur des colonnes
    const colWidths = headers.map((header) => ({ wch: Math.max(header.length * 1.5, 10) }))
    worksheet["!cols"] = colWidths

    // Appliquer des styles aux en-têtes
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")

    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col })
        if (!worksheet[cellRef]) continue

        worksheet[cellRef].s = {
            fill: { fgColor: { rgb: "4F46E5" }, patternType: "solid" }, // Couleur primaire (indigo-600)
            font: { bold: true, color: { rgb: "FFFFFF" } },
            border: {
                top: { style: "thin", color: { rgb: "D1D5DB" } },
                bottom: { style: "thin", color: { rgb: "D1D5DB" } },
                left: { style: "thin", color: { rgb: "D1D5DB" } },
                right: { style: "thin", color: { rgb: "D1D5DB" } },
            },
            alignment: { horizontal: "center", vertical: "center" },
        }
    }

    // Ajouter une ligne vide pour exemple
    const emptyRow = headers.map(() => "")
    XLSX.utils.sheet_add_aoa(worksheet, [emptyRow], { origin: -1 })

    // Créer un classeur
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Modèle")

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        bookSST: false,
        cellStyles: true,
    })

    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    saveAs(blob, filename)
}

// Fonction pour générer un modèle CSV vide basé sur le schéma
export function generateCSVTemplate(headers: string[], filename = "template.csv") {
    const csvContent = headers.map((header) => `"${header.replace(/"/g, '""')}"`).join(",")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    saveAs(blob, filename)
}
