/*
  Warnings:

  - You are about to drop the column `deadline` on the `Event` table. All the data in the column will be lost.
  - Made the column `moneyGoal` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "deadline",
ADD COLUMN     "deadlineDate" TEXT,
ADD COLUMN     "deadlineTime" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "moneyGoal" SET NOT NULL;
