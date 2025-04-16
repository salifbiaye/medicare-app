// lib/repositories/user.repository.ts
import prisma from "@/lib/prisma"
import {User} from "@prisma/client";

export const UserRepository = {

    async createUser(data: User) {
        return await prisma.user.create({
            data,
        })
    },

    async updateUser(id: string, data: Partial<User>) {
        return await prisma.user.update({
            where: { id },
            data,
        })
    },

    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id },
        })
    },

    async getAllUsers() {
        return await prisma.user.findMany()
    },

    async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        })
    },

    async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        })
    },
}