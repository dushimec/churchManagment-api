/*
  Warnings:

  - You are about to drop the column `brideEmail` on the `marriage_requests` table. All the data in the column will be lost.
  - You are about to drop the column `brideName` on the `marriage_requests` table. All the data in the column will be lost.
  - You are about to drop the column `bridePhone` on the `marriage_requests` table. All the data in the column will be lost.
  - You are about to drop the column `groomEmail` on the `marriage_requests` table. All the data in the column will be lost.
  - You are about to drop the column `groomName` on the `marriage_requests` table. All the data in the column will be lost.
  - You are about to drop the column `groomPhone` on the `marriage_requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brideId` to the `marriage_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groomId` to the `marriage_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."marriage_requests" DROP COLUMN "brideEmail",
DROP COLUMN "brideName",
DROP COLUMN "bridePhone",
DROP COLUMN "groomEmail",
DROP COLUMN "groomName",
DROP COLUMN "groomPhone",
ADD COLUMN     "brideId" TEXT NOT NULL,
ADD COLUMN     "brideIdDocumentUrl" TEXT,
ADD COLUMN     "groomId" TEXT NOT NULL,
ADD COLUMN     "groomIdDocumentUrl" TEXT;

-- CreateIndex
CREATE INDEX "marriage_bride_groom_idx" ON "public"."marriage_requests"("brideId", "groomId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."marriage_requests" ADD CONSTRAINT "marriage_requests_brideId_fkey" FOREIGN KEY ("brideId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marriage_requests" ADD CONSTRAINT "marriage_requests_groomId_fkey" FOREIGN KEY ("groomId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
