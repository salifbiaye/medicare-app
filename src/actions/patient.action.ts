"use server"

import { CreatePatientFormValues, PatientImport } from "@/schemas/user.schema"
import { PatientService } from "@/services/patient.service"
import { revalidatePath } from "next/cache"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"
import { CreateMedicalRecordFormValues } from "@/schemas/medical-record.schema"
import { 
  CreateMedicalReportFormValues, 
  CreatePrescriptionFormValues, 
  CreateDicomImageFormValues 
} from "@/schemas/medical-document.schema"

export async function createPatientAction(data: CreatePatientFormValues) {
    return await PatientService.createPatient(data)
}



export async function updatePatientAction(userId: string, data: CreatePatientFormValues) {
    const result = await PatientService.updatePatient(userId, data)
    revalidatePath("/admin/users")
    return result
}

export async function getPatientsWithPaginationAction(params: ParamsSchemaFormValues) {
    return await PatientService.getPatientsWithPagination(params)
}

export async function deletePatientAction(patientId: string) {
    const result = await PatientService.deletePatient(patientId)
    revalidatePath("/admin/users")
    return result
}

export async function createMedicalRecordAction(data: CreateMedicalRecordFormValues) {
    return await PatientService.createMedicalRecord(data)
}

export async function createMedicalReportAction(data: CreateMedicalReportFormValues) {
    return await PatientService.createMedicalReport(data)
}

export async function createPrescriptionAction(data: CreatePrescriptionFormValues) {
    return await PatientService.createPrescription(data)
}

export async function createDicomImageAction(data: CreateDicomImageFormValues) {
    return await PatientService.createDicomImage(data)
}

export async function getMedicalReportsByMedicalRecordIdAction(medicalRecordId: string) {
    return await PatientService.getMedicalReportsByMedicalRecordId(medicalRecordId)
}

export async function getPrescriptionsByMedicalRecordIdAction(medicalRecordId: string) {
    return await PatientService.getPrescriptionsByMedicalRecordId(medicalRecordId)
}

export async function getDicomImagesByMedicalRecordIdAction(medicalRecordId: string) {
    return await PatientService.getDicomImagesByMedicalRecordId(medicalRecordId)
}

export async function getMedicalReportByIdAction(reportId: string) {
    return await PatientService.getMedicalReportById(reportId)
}

export async function getPrescriptionByIdAction(prescriptionId: string) {
    return await PatientService.getPrescriptionById(prescriptionId)
} 