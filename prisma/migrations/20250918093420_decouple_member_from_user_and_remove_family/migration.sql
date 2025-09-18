/*
  Warnings:

  - You are about to drop the column `emergencyContactName` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactPhone` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfChildren` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `spouseName` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `spousePhone` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `family_members` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `names` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."family_members" DROP CONSTRAINT "family_members_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."members" DROP CONSTRAINT "members_userId_fkey";

-- DropIndex
DROP INDEX "public"."members_userId_key";

-- AlterTable
ALTER TABLE "public"."members" DROP COLUMN "emergencyContactName",
DROP COLUMN "emergencyContactPhone",
DROP COLUMN "numberOfChildren",
DROP COLUMN "spouseName",
DROP COLUMN "spousePhone",
DROP COLUMN "userId",
ADD COLUMN     "cell" TEXT,
ADD COLUMN     "churchCell" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "names" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "sector" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "memberId";

-- DropTable
DROP TABLE "public"."family_members";
