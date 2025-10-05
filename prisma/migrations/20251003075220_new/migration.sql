/*
  Warnings:

  - You are about to drop the column `userId` on the `BookingParticipant` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,bookingId]` on the table `BookingParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `BookingParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BookingParticipant" DROP CONSTRAINT "BookingParticipant_userId_fkey";

-- DropIndex
DROP INDEX "public"."BookingParticipant_userId_bookingId_key";

-- AlterTable
ALTER TABLE "public"."BookingParticipant" DROP COLUMN "userId",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "public"."Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingParticipant_studentId_bookingId_key" ON "public"."BookingParticipant"("studentId", "bookingId");

-- AddForeignKey
ALTER TABLE "public"."BookingParticipant" ADD CONSTRAINT "BookingParticipant_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
