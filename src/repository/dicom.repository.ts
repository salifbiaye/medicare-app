import prisma from "@/lib/prisma"

export class DicomRepository {
    static async findDicomById(id: string) {
        return await prisma.dicomImage.findUnique({
            where: { id }
        })
    }
    static async findDicomByOrthancId(orthancId: string) {
        return prisma.dicomImage.findFirst({
            where: {
                orthanc_id: orthancId
            }
        });
    }

    static async createDicomSharing(data: {
        dicomImageId: string
        sourceDoctorId: string
        targetDoctorId: string
    }) {
        return await prisma.dicomSharing.create({
            data: {
                dicomImageId: data.dicomImageId,
                sourceDoctorId: data.sourceDoctorId,
                targetDoctorId: data.targetDoctorId
            }
        })
    }

    static async createNotification(data: {
        title: string
        message: string
        type: string
        category: string
        priority: string
        senderId: string
        recipientId: string
    }) {
        return await prisma.notification.create({
            data,
        })
    }
} 