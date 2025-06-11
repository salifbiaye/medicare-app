import prisma from "@/lib/prisma"
import { Hospital } from "@prisma/client"
import { CreateHospitalFormValues, HospitalFilterSchema } from "@/schemas/hospital.schema"

export class HospitalRepository {
    static async createHospital(data: CreateHospitalFormValues) {
        const newdata = {
            ...data,
            phone: data.phone.toString(),
        }
        return await prisma.hospital.create({
            data: newdata,
        })
    }

    static async createManyHospitals(data: CreateHospitalFormValues[]) {
        const newdata = data.map((hospital) => ({
            ...hospital,
            phone: hospital.phone.toString(),
        }))
        return await prisma.hospital.createMany({
            data: newdata,
        })
    }

    static async updateHospital(id: string, data: CreateHospitalFormValues) {
        const newdata = {
            ...data,
            phone: data.phone.toString(),
        }
        return await prisma.hospital.update({
            where: { id },
            data: newdata,
        })
    }

    static async deleteHospital(id: string) {
        return await prisma.hospital.delete({
            where: { id },
        })
    }

    static async deleteManyHospitals(ids: string[]) {
        return await prisma.hospital.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }

    static async getAllHospitals() {
        return await prisma.hospital.findMany()
    }

    static async getHospitalById(id: string) {
        return await prisma.hospital.findUnique({
            where: { id },
        })
    }

    static async getHospitalByEmail(email: string) {
        return await prisma.hospital.findFirst({
            where: { email },
        })
    }

    static async getHospitalsWithPagination(params: {
        page: number
        perPage: number
        sort?: string
        search?: string
        filters?: HospitalFilterSchema
    }) {
        const { page, perPage, sort, search, filters } = params
        const skip = (page - 1) * perPage

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
            ]
        }

        if (filters?.name?.length) {
            where.name = { in: filters.name }
        }

        if (filters?.email?.length) {
            where.email = { in: filters.email }
        }

        // Build orderBy
        let orderBy: any = { createdAt: "desc" }
        if (sort) {
            const [column, order] = sort.split(".")
            orderBy = { [column]: order }
        }

        const totalHospitals = await prisma.hospital.count({ where })

        const hospitals = await prisma.hospital.findMany({
            where,
            orderBy,
            skip,
            take: perPage,
            select: {
                id: true,
                name: true,
                address: true,
                phone: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return { hospitals, totalHospitals }
    }

    static async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        })
    }

    static async getHospitalStats() {
        const totalHospitals = await prisma.hospital.count();
        return {
            totalHospitals
        };
    }

    static async getLatestHospitals(limit: number = 5) {
        return await prisma.hospital.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    static async getHospitalsByDateRange(params: {
        startDate: Date;
        endDate: Date;
    }) {
        const { startDate, endDate } = params;

        const hospitals = await prisma.hospital.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                id: true,
                createdAt: true,
            }
        });

        return hospitals;
    }

    static async getHospitalsForSelect() {
        const hospitals = await prisma.hospital.findMany({
            select: {
                id: true,
                name: true,
            },
        })
        return hospitals.map((hospital) => ({
            value: hospital.id,
            label: hospital.name,
        }))
    }
} 