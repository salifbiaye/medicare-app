-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
