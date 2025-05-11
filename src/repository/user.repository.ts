import prisma from "@/lib/prisma"
import { User } from "@prisma/client";
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

    static async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        })
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
            totalDirectors
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'PATIENT' } }),
            prisma.user.count({ where: { role: 'DOCTOR' } }),
            prisma.user.count({ where: { role: 'CHIEF_DOCTOR' } }),
            prisma.user.count({ where: { role: 'SECRETARY' } }),
            prisma.user.count({ where: { role: 'DIRECTOR' } })
        ]);

        return {
            totalUsers,
            totalPatients,
            totalDoctors,
            totalChiefDoctors,
            totalSecretaries,
            totalDirectors
        };
    }
}
