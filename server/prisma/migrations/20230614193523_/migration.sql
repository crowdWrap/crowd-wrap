/*
  Warnings:

  - You are about to drop the column `registerdWith` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "registerdWith",
ADD COLUMN     "registeredWith" TEXT;
