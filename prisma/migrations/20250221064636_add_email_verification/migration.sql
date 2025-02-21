/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "google_id" TEXT,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_code" TEXT,
ADD COLUMN     "verification_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");
