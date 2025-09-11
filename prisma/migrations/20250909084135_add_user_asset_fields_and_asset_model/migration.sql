-- CreateEnum
CREATE TYPE "public"."AssetType" AS ENUM ('IMAGE', 'DOCUMENT', 'VIDEO');

-- CreateEnum
CREATE TYPE "public"."AssetCategory" AS ENUM ('VEHICLE_IMAGE');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "public"."AssetType" NOT NULL,
    "category" "public"."AssetCategory" NOT NULL,
    "publicId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_userId_key" ON "public"."Asset"("userId");

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
