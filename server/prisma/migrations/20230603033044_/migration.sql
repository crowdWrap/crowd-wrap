/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "socketId" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Session_socketId_key" ON "Session"("socketId");
