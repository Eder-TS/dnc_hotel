/*
  Warnings:

  - You are about to drop the column `approved` on the `reservations` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationsStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "approved",
ADD COLUMN     "status" "ReservationsStatus" NOT NULL DEFAULT 'PENDING';
