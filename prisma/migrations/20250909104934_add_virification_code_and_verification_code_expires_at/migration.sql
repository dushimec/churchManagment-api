-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "verificationCode" INTEGER,
ADD COLUMN     "verificationCodeExpiresAt" TIMESTAMP(3);
