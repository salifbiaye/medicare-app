-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('PECTORALS', 'BICEPS', 'TRICEPS', 'ABDOMINALS', 'LEGS', 'BACK', 'SHOULDERS', 'CALVES');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT,
    "goals" TEXT,
    "musculatureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Musculature" (
    "id" TEXT NOT NULL,
    "PECTORALS" INTEGER NOT NULL DEFAULT 0,
    "BICEPS" INTEGER NOT NULL DEFAULT 0,
    "TRICEPS" INTEGER NOT NULL DEFAULT 0,
    "ABDOMINALS" INTEGER NOT NULL DEFAULT 0,
    "LEGS" INTEGER NOT NULL DEFAULT 0,
    "BACK" INTEGER NOT NULL DEFAULT 0,
    "SHOULDERS" INTEGER NOT NULL DEFAULT 0,
    "CALVES" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Musculature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "muscleGroups" "MuscleGroup"[],
    "intensity" INTEGER NOT NULL DEFAULT 1,
    "type" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramDay" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "muscleTargets" "MuscleGroup"[],
    "programId" TEXT NOT NULL,

    CONSTRAINT "ProgramDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SessionExercises" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SessionExercises_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_musculatureId_key" ON "User"("musculatureId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingSession_userId_key" ON "TrainingSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_userId_key" ON "Program"("userId");

-- CreateIndex
CREATE INDEX "_SessionExercises_B_index" ON "_SessionExercises"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_musculatureId_fkey" FOREIGN KEY ("musculatureId") REFERENCES "Musculature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramDay" ADD CONSTRAINT "ProgramDay_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionExercises" ADD CONSTRAINT "_SessionExercises_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionExercises" ADD CONSTRAINT "_SessionExercises_B_fkey" FOREIGN KEY ("B") REFERENCES "TrainingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
