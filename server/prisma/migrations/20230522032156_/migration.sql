/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `EventToUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventToUser_userId_eventId_key" ON "EventToUser"("userId", "eventId");
