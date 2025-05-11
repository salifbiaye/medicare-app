import prisma from "@/lib/prisma"

export class AccountRepository {
    static async findAccountByUserId(userId: string) {
        return await prisma.account.findFirst({
            where: { userId }
        })
    }
    static async updatePassword(id: string, password: string) {
        return await prisma.account.update({
            where: { id },
            data: { password },
        })
    }
}


