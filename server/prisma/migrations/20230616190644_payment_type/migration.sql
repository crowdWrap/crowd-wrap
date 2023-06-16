/*
  Warnings:

  - You are about to drop the column `stripeAccountId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeAccountId",
ADD COLUMN     "paymentType" TEXT NOT NULL DEFAULT '';
