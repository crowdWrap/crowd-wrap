-- DropForeignKey
ALTER TABLE "EventToUser" DROP CONSTRAINT "EventToUser_eventId_fkey";

-- AddForeignKey
ALTER TABLE "EventToUser" ADD CONSTRAINT "EventToUser_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
