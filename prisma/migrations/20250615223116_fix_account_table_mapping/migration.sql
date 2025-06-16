/*
  Warnings:

  - You are about to drop the column `isChief` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[hospitalId]` on the table `directors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `hospitals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `hospitals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'ERROR', 'MESSAGE', 'APPOINTMENT', 'DOCUMENT', 'SYSTEM', 'PRESCRIPTION', 'LAB', 'VITAL');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('MEDICAL', 'ADMINISTRATIVE', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_requestId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_userId_fkey";

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "requestId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dicom_images" ADD COLUMN     "orthanc_url" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "isChief";

-- AlterTable
ALTER TABLE "hospitals" ADD COLUMN     "urlOrthanc" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "patient";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'LOW',
    "category" "NotificationCategory" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "senderId" TEXT,
    "recipientId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipientId_createdAt_idx" ON "Notification"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_priority_idx" ON "Notification"("type", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "directors_hospitalId_key" ON "directors"("hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_phone_key" ON "hospitals"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_email_key" ON "hospitals"("email");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "appointment_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
