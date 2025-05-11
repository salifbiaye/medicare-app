"use server"

import { CreatePatientFormValues, PatientImport } from "@/schemas/user.schema"
import { PatientService } from "@/services/patient.service"

export async function createPatientAction(data: CreatePatientFormValues) {
    return await PatientService.createPatient(data)
}

export async function importPatientsAction(data: PatientImport[]) {
    return await PatientService.importPatients(data)
} 