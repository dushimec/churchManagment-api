/*
  Warnings:

  - The values [VEHICLE_IMAGE] on the enum `AssetCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AssetCategory_new" AS ENUM ('PROFILE_IMAGE');
ALTER TABLE "public"."Asset" ALTER COLUMN "category" TYPE "public"."AssetCategory_new" USING ("category"::text::"public"."AssetCategory_new");
ALTER TYPE "public"."AssetCategory" RENAME TO "AssetCategory_old";
ALTER TYPE "public"."AssetCategory_new" RENAME TO "AssetCategory";
DROP TYPE "public"."AssetCategory_old";
COMMIT;
