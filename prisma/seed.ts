import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medicare.com' },
    update: {},
    create: {
      email: 'admin@medicare.com',
      name: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
      profileCompleted: true,
      accounts: {
        create: {
          id: 'admin-account',
          accountId: 'admin-account',
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })