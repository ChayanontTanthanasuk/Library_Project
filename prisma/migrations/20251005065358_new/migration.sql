/*
  Warnings:

  - Added the required column `roomCapacity` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "roomCapacity" INTEGER NOT NULL,
ADD COLUMN     "roomName" TEXT NOT NULL;
