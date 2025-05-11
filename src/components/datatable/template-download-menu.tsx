"use client"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generateExcelTemplate, generateCSVTemplate } from "@/lib/export-utils"

interface TemplateDownloadMenuProps {
    headers: string[]
    filename?: string
}

export function TemplateDownloadMenu({ headers, filename = "template" }: TemplateDownloadMenuProps) {
    const handleDownloadExcel = () => {
        generateExcelTemplate(headers, `${filename}.xlsx`)
    }

    const handleDownloadCSV = () => {
        generateCSVTemplate(headers, `${filename}.csv`)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger le modèle
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={handleDownloadExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Modèle Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadCSV}>
                    <FileText className="mr-2 h-4 w-4" />
                    Modèle CSV
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
