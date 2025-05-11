"use client"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"
import { exportToCSV, exportToExcel } from "@/lib/export-utils"

interface ExportMenuProps<TData, TValue> {
    data: TData[]
    columns: ColumnDef<TData, TValue>[]
    filename?: string
}

export function ExportMenu<TData, TValue>({ data, columns, filename = "export" }: ExportMenuProps<TData, TValue>) {
    const handleExportCSV = () => {
        exportToCSV(data, columns, `${filename}.csv`)
    }

    const handleExportExcel = () => {
        exportToExcel(data, columns, `${filename}.xlsx`)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={handleExportCSV}>
                    <FileText className="mr-2 h-4 w-4" />
                    Exporter en CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exporter en Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
