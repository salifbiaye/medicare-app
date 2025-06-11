"use server"
import { DicomService } from "@/services/dicom.service"

export async function shareDicomAction({
  dicomId,
  doctorEmail
}: {
  dicomId: string
  doctorEmail: string
}) {
  return await DicomService.shareDicom({
    dicomId,
    doctorEmail
  })
} 