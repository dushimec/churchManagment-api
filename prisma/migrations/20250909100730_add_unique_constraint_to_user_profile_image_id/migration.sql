/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileImageId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Asset_userId_key";

-- DropIndex
DROP INDEX "public"."contributions_transactionId_key";

-- DropIndex
DROP INDEX "public"."services_choirLeaderId_key";

-- DropIndex
DROP INDEX "public"."services_preacherId_key";

-- DropIndex
DROP INDEX "public"."users_email_key";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "profileImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_publicId_key" ON "public"."Asset"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "users_profileImageId_key" ON "public"."users"("profileImageId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
