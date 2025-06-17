import prisma from "@/lib/prisma"
import { Service } from "@prisma/client"
import { CreateServiceFormValues, ServiceFilterSchema } from "@/schemas/service.schema"

export class ServiceRepository {
    static async createService(data: CreateServiceFormValues) {
        return await prisma.service.create({
            data: data,
        })
    }

    static async createManyServices(data: CreateServiceFormValues[]) {
        return await prisma.service.createMany({
            data: data,
        })
    }

    static async updateService(id: string, data: Partial<Service>) {
        return await prisma.service.update({
            where: { id },
            data,
        })
    }

    static async deleteService(id: string) {
        return await prisma.service.delete({
            where: { id },
        })
    }

    static async deleteManyServices(ids: string[]) {
        return await prisma.service.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }

    static async getAllServices() {
        return await prisma.service.findMany()
    }

    static async getServiceById(id: string) {
        return await prisma.service.findUnique({
            where: { id },
        })
    }

    static async getHospitalById(id: string) {
        return await prisma.hospital.findUnique({
            where: { id },
        })
    }

    static async getServicesByHospitalId(hospitalId: string) {
        return await prisma.service.findMany({
            where: { hospitalId },
        })
    }

    static async getServicesWithPagination(params: {
        page: number
        perPage: number
        sort?: string
        search?: string
        filters?: ServiceFilterSchema
    }) {
        const { page, perPage, sort, search, filters } = params
        const skip = (page - 1) * perPage

        // Force tous les filtres à être des tableaux s'ils existent
        const normalizedFilters = {
            type: filters?.type
                ? Array.isArray(filters.type)
                    ? filters.type
                    : [filters.type]
                : undefined,
            name: filters?.name
                ? Array.isArray(filters.name)
                    ? filters.name
                    : [filters.name]
                : undefined,
            hospitalId: filters?.hospitalId
                ? Array.isArray(filters.hospitalId)
                    ? filters.hospitalId
                    : [filters.hospitalId]
                : undefined,
        }

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ]
        }

        if (normalizedFilters.type?.length) {
            where.type = { in: normalizedFilters.type }
        }

        if (normalizedFilters.name?.length) {
            where.name = { in: normalizedFilters.name }
        }

        if (normalizedFilters.hospitalId?.length) {
            where.hospitalId = { in: normalizedFilters.hospitalId }
        }

        // Build orderBy
        let orderBy: any = { createdAt: "desc" }
        if (sort) {
            const [column, order] = sort.split(".")
            orderBy = { [column]: order }
        }

        const totalServices = await prisma.service.count({ where })

        const services = await prisma.service.findMany({
            where,
            orderBy,
            skip,
            take: perPage,
            select: {
                id: true,
                type: true,
                name: true,
                description: true,
                hospitalId: true,
                hospital: {
                    select: {
                        name: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        })

        // Ajoute le nom de l'hôpital et supprime l'objet hospital
        const servicesWithHospitalName = services.map(service => ({
            ...service,
            hospitalName: service.hospital.name,
            hospital: undefined,
        }))

        return { services: servicesWithHospitalName, totalServices }
    }


    static async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        })
    }

    static async getDirectorByUserId(userId: string) {
        return await prisma.director.findFirst({
            where: { userId },
        })
    }

    static async getServiceStats(hospitalId: string) {
        const totalServices = await prisma.service.count({
            where: {
                hospitalId: hospitalId
            }
        });
        const servicesByType = await prisma.service.groupBy({
            by: ['type'],
            where: {
                hospitalId: hospitalId
            },
            _count: {
                type: true
            }
        });
        
        return {
            totalServices,
            servicesByType: servicesByType.map(item => ({
                type: item.type,
                count: item._count.type
            }))
        };
    }

    static async getLatestServices(limit: number = 5, hospitalId: string) {
        return await prisma.service.findMany({
            where: {
                hospitalId: hospitalId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            select: {
                id: true,
                type: true,
                name: true,
                description: true,
                hospitalId: true,
                hospital: {
                    select: {
                        name: true,
                    },
                },
                createdAt: true
            }
        })
    }

    static async getServicesByDateRange(params: {
        startDate: Date;
        endDate: Date;
        hospitalId: string;
    }) {
        return await prisma.service.findMany({
            where: {
                hospitalId: params.hospitalId,
                createdAt: {
                    gte: params.startDate,
                    lte: params.endDate
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                type: true,
                name: true,
                description: true,
                hospitalId: true,
                createdAt: true,
                hospital: {
                    select: {
                        name: true
                    }
                }
            }
        });
    }

    static async getServicesByIds(ids: string[]) {
        return await prisma.service.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }
} 