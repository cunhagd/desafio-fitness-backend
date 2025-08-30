/*
  Warnings:

  - A unique constraint covering the columns `[partnerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "partnerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_partnerId_key" ON "public"."User"("partnerId");
