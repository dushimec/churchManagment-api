/*
  Warnings:

  - You are about to drop the column `eventId` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `parent1Email` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `parent1Name` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `parent1Phone` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `parent2Email` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `parent2Name` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `parent2Phone` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `pastorNotes` on the `baptism_requests` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAt` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `marriage_requests` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedById` on the `media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,userId]` on the table `event_registrations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `event_registrations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RecommendationType" AS ENUM ('YOUTH', 'OLD');

-- DropForeignKey
ALTER TABLE "public"."baptism_requests" DROP CONSTRAINT "baptism_requests_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."event_registrations" DROP CONSTRAINT "event_registrations_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."marriage_requests" DROP CONSTRAINT "marriage_requests_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."media" DROP CONSTRAINT "media_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."media" DROP CONSTRAINT "media_uploadedById_fkey";

-- DropIndex
DROP INDEX "public"."event_registrations_eventId_memberId_key";

-- AlterTable
ALTER TABLE "public"."baptism_requests" DROP COLUMN "eventId",
DROP COLUMN "parent1Email",
DROP COLUMN "parent1Name",
DROP COLUMN "parent1Phone",
DROP COLUMN "parent2Email",
DROP COLUMN "parent2Name",
DROP COLUMN "parent2Phone",
DROP COLUMN "pastorNotes";

-- AlterTable
ALTER TABLE "public"."event_registrations" DROP COLUMN "memberId",
DROP COLUMN "registeredAt",
DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "endDate",
DROP COLUMN "maxParticipants",
DROP COLUMN "startDate",
DROP COLUMN "status",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "organizerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."login_activities" ALTER COLUMN "success" SET DEFAULT true;

-- AlterTable
ALTER TABLE "public"."marriage_requests" DROP COLUMN "eventId";

-- AlterTable
ALTER TABLE "public"."media" DROP COLUMN "description",
DROP COLUMN "eventId",
DROP COLUMN "fileType",
DROP COLUMN "uploadedById",
ADD COLUMN     "type" "public"."AssetType" NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."youth_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "churchCell" TEXT NOT NULL,
    "youthFamily" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "youth_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cell_recommendations" (
    "id" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "churchCellName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cell_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."church_recommendations" (
    "id" TEXT NOT NULL,
    "type" "public"."RecommendationType" NOT NULL,
    "idNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "district" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "cellRecommendation" TEXT NOT NULL,
    "youthRecommendation" TEXT,
    "passportPhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "church_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."baptism_certifications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "baptismDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "baptism_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."marriage_certificates" (
    "id" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "brideEmail" TEXT NOT NULL,
    "groomEmail" TEXT NOT NULL,
    "bridePhone" TEXT NOT NULL,
    "groomPhone" TEXT NOT NULL,
    "brideAddress" TEXT NOT NULL,
    "groomAddress" TEXT NOT NULL,
    "marenName" TEXT NOT NULL,
    "parenName" TEXT NOT NULL,
    "parentAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marriage_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wedding_service_requests" (
    "id" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "brideEmail" TEXT NOT NULL,
    "groomEmail" TEXT NOT NULL,
    "bridePhone" TEXT NOT NULL,
    "groomPhone" TEXT NOT NULL,
    "marenName" TEXT NOT NULL,
    "parenName" TEXT NOT NULL,
    "idCopies" TEXT[],
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."child_dedication_requests" (
    "id" TEXT NOT NULL,
    "parentNames" TEXT NOT NULL,
    "childNames" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "dedicationDate" TIMESTAMP(3) NOT NULL,
    "churchService" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_dedication_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_eventId_userId_key" ON "public"."event_registrations"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_registrations" ADD CONSTRAINT "event_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
