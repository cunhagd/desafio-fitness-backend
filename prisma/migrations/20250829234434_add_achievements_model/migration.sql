-- CreateEnum
CREATE TYPE "public"."AchievementType" AS ENUM ('WEIGHT_LOSS_1KG', 'WEIGHT_LOSS_3KG', 'WEIGHT_LOSS_5KG', 'WEIGHT_LOSS_10KG', 'FIRST_WEIGHT_LOG', 'FIRST_ERROR_LOG');

-- CreateTable
CREATE TABLE "public"."UserAchievement" (
    "id" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."AchievementType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_type_key" ON "public"."UserAchievement"("userId", "type");

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
