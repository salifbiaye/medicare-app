import prisma from "@/lib/prisma"
import { User, Role } from "@prisma/client";
import {CreateUserFormValues} from "@/schemas/user.schema";

export class UserRepository {
    static async createUser(data: CreateUserFormValues) {
        return await prisma.user.create({
            data,
        })
    }
    static async createManyUser(data: CreateUserFormValues[]) {
        return await prisma.user.createMany({
            data,
        })
    }

    static async updateUser(id: string, data: Partial<User>) {
        return await prisma.user.update({
            where: { id },
            data,
        })
    }
    static async updateUserByEmail(email: string, data: Partial<User>) {
        return await prisma.user.update({
            where: { email },
            data,
        })
    }

    static async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id },
        })
    }
    static async deleteManyUsers(ids: string[]) {
        return await prisma.user.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    }


    static async getAllUsers() {
        return await prisma.user.findMany()
    }

    static async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        })
    }

    static async getUserWithRelations(id: string) {
        // Récupérer d'abord l'utilisateur de base
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        // Récupérer les données spécifiques au rôle
        let relationData = null;
        
        switch (user.role) {
            case 'DOCTOR':
            case 'CHIEF_DOCTOR':
                relationData = await prisma.doctor.findUnique({
                    where: { userId: id },
                    include: {
                        hospital: true,
                        service: true
                    }
                });
                break;
            case 'SECRETARY':
                relationData = await prisma.secretary.findUnique({
                    where: { userId: id },
                    include: {
                        hospital: true,
                        service: true
                    }
                });
                break;
            case 'DIRECTOR':
                relationData = await prisma.director.findUnique({
                    where: { userId: id },
                    include: {
                        hospital: true
                    }
                });
                break;
            case 'PATIENT':
                relationData = await prisma.patient.findUnique({
                    where: { userId: id }
                });
                break;
            default:
                // Pour les admins ou autres rôles sans relations spécifiques
                break;
        }

        // Retourner l'utilisateur avec ses données de relation
        return {
            ...user,
            relationData
        };
    }

    static async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        })
    }

    static async getDirectorByUserId(userId: string) {
        return await prisma.director.findUnique({
            where: { userId },
        })
    }

    static async getUsersByHospital(params: {
        page: number;
        perPage: number;
        sort?: string;
        search?: string;
        filters?: {
            role?: string[];
            gender?: string[];
            profileCompleted?: string[];
        };
        hospitalId: string;
    }) {
        const { page, perPage, sort, search, filters, hospitalId } = params;
        const skip = (page - 1) * perPage;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        if (filters?.role?.length) {
            where.role = { in: filters.role };
        }

        if (filters?.gender?.length) {
            where.gender = { in: filters.gender };
        }

        if (filters?.profileCompleted?.length) {
            // Handle profileCompleted filter
            const booleanValues = filters.profileCompleted.map(v => v === "true");
            // If both true and false are selected, don't apply the filter
            if (!(booleanValues.includes(true) && booleanValues.includes(false))) {
                where.profileCompleted = booleanValues[0];
            }
        }

        // Récupérer les IDs des utilisateurs affiliés à l'hôpital
        // Médecins
        const doctors = await prisma.doctor.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Secrétaires
        const secretaries = await prisma.secretary.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Combiner les IDs
        const hospitalUserIds = [
            ...doctors.map(d => d.userId),
            ...secretaries.map(s => s.userId)
        ];

        // Ajouter la condition sur les IDs d'utilisateurs
        where.id = { in: hospitalUserIds };

        // Build orderBy
        let orderBy: any = { createdAt: "desc" };
        if (sort) {
            const [column, order] = sort.split(".");
            orderBy = { [column]: order };
        }

        const totalUsers = await prisma.user.count({ where });

        const users = await prisma.user.findMany({
            where,
            orderBy,
            skip,
            take: perPage,
            select: {
                id: true,
                email: true,
                name: true,
                gender: true,
                role: true,
                profileCompleted: true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true,
                image: true,
            },
        });

        return { users, totalUsers };
    }

    static async getUsersWithPagination(params: {
        page: number;
        perPage: number;
        sort?: string;
        search?: string;
        filters?: {
            role?: string[];
            gender?: string[];
            profileCompleted?: string[];
        };
    }) {
        const { page, perPage, sort, search, filters } = params;
        const skip = (page - 1) * perPage;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        if (filters?.role?.length) {
            where.role = { in: filters.role };
        }

        if (filters?.gender?.length) {
            where.gender = { in: filters.gender };
        }

        if (filters?.profileCompleted?.length) {
            // Handle profileCompleted filter
            const booleanValues = filters.profileCompleted.map(v => v === "true");
            // If both true and false are selected, don't apply the filter
            if (!(booleanValues.includes(true) && booleanValues.includes(false))) {
                where.profileCompleted = booleanValues[0];
            }
        }

        // Build orderBy
        let orderBy: any = { createdAt: "desc" };
        if (sort) {
            const [column, order] = sort.split(".");
            orderBy = { [column]: order };
        }

        const totalUsers = await prisma.user.count({ where });

        const users = await prisma.user.findMany({
            where,
            orderBy,
            skip,
            take: perPage,
            select: {
                id: true,
                email: true,
                name: true,
                gender: true,
                role: true,
                profileCompleted: true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true,
                image: true,
            },
        });

        return { users, totalUsers };
    }

    static async getUsersByDateRange(params: {
        startDate: Date;
        endDate: Date;
        page?: number;
        perPage?: number;
    }) {
        const { startDate, endDate, page = 1, perPage = 10 } = params;
        const skip = (page - 1) * perPage;

        const where = {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: perPage,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    role: true,
                    profileCompleted: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                    image: true,
                }
            }),
            prisma.user.count({ where })
        ]);

        return { users, total };
    }

    static async getLatestUsers(limit: number = 10) {
        return await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            select: {
                id: true,
                email: true,
                name: true,
                gender: true,
                role: true,
                profileCompleted: true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true,
                image: true,
            }
        });
    }

    static async getUserStats() {
        const [
            totalUsers,
            totalPatients,
            totalDoctors,
            totalChiefDoctors,
            totalSecretaries,
            totalDirectors,
            totalAdmins
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'PATIENT' } }),
            prisma.user.count({ where: { role: 'DOCTOR' } }),
            prisma.user.count({ where: { role: 'CHIEF_DOCTOR' } }),
            prisma.user.count({ where: { role: 'SECRETARY' } }),
            prisma.user.count({ where: { role: 'DIRECTOR' } }),
            prisma.user.count({ where: { role: 'ADMIN' } })
        ]);

        return {
            totalUsers,
            totalPatients,
            totalDoctors,
            totalChiefDoctors,
            totalSecretaries,
            totalDirectors,
            totalAdmins
        };
    }

    // Personnel methods for director dashboard
    static async getPersonnelStatsByHospital(hospitalId: string) {
        // Récupérer les IDs des utilisateurs affiliés à l'hôpital
        // Médecins
        const doctors = await prisma.doctor.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Secrétaires
        const secretaries = await prisma.secretary.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Combiner les IDs
        const hospitalUserIds = [
            ...doctors.map(d => d.userId),
            ...secretaries.map(s => s.userId)
        ];

        // Récupérer les utilisateurs
        const users = await prisma.user.findMany({
            where: {
                id: { in: hospitalUserIds }
            },
            select: {
                id: true,
                role: true
            }
        });

        // Calculer les statistiques
        const totalPersonnel = users.length;
        const totalDoctors = users.filter(u => u.role === "DOCTOR").length;
        const totalChiefDoctors = users.filter(u => u.role === "CHIEF_DOCTOR").length;
        const totalSecretaries = users.filter(u => u.role === "SECRETARY").length;

        return {
            totalPersonnel,
            totalDoctors,
            totalChiefDoctors,
      
            totalSecretaries,
      
        };
    }

    static async getPersonnelByDateRangeAndHospital(params: {
        startDate: Date;
        endDate: Date;
        hospitalId: string;
        page?: number;
        perPage?: number;
    }) {
        const { startDate, endDate, hospitalId, page = 1, perPage = 10 } = params;

        // Récupérer les IDs des utilisateurs affiliés à l'hôpital
        // Médecins
        const doctors = await prisma.doctor.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Secrétaires
        const secretaries = await prisma.secretary.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Combiner les IDs
        const hospitalUserIds = [
            ...doctors.map(d => d.userId),
            ...secretaries.map(s => s.userId)
        ];

        // Récupérer les utilisateurs dans la plage de dates
        const personnel = await prisma.user.findMany({
            where: {
                id: { in: hospitalUserIds },
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
                name: true,
                email: true,
                role: true,
                createdAt: true,
                image: true
            }
        });

        return { personnel };
    }

    static async getLatestPersonnelByHospital(hospitalId: string, limit: number = 5) {
        // Récupérer les IDs des utilisateurs affiliés à l'hôpital
        // Médecins
        const doctors = await prisma.doctor.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Secrétaires
        const secretaries = await prisma.secretary.findMany({
            where: { hospitalId },
            select: { userId: true }
        });

        // Combiner les IDs
        const hospitalUserIds = [
            ...doctors.map(d => d.userId),
            ...secretaries.map(s => s.userId)
        ];

        // Récupérer les derniers utilisateurs
        return await prisma.user.findMany({
            where: {
                id: { in: hospitalUserIds }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                image: true
            }
        });
    }
}
