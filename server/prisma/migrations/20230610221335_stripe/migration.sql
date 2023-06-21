/*
  Warnings:

  - Made the column `Currentfunds` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deadlineDate` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "Currentfunds" SET NOT NULL,
ALTER COLUMN "deadlineDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeAccountId" TEXT;
