/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Invitation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Invitation_token_key";

-- AlterTable
ALTER TABLE "public"."Invitation" DROP COLUMN "expiresAt",
DROP COLUMN "token";

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_invitedEmail_fkey" FOREIGN KEY ("invitedEmail") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
