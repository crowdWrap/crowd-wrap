-- CreateTable
CREATE TABLE "_Friend" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FriendRequests" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Friend_AB_unique" ON "_Friend"("A", "B");

-- CreateIndex
CREATE INDEX "_Friend_B_index" ON "_Friend"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FriendRequests_AB_unique" ON "_FriendRequests"("A", "B");

-- CreateIndex
CREATE INDEX "_FriendRequests_B_index" ON "_FriendRequests"("B");

-- AddForeignKey
ALTER TABLE "_Friend" ADD CONSTRAINT "_Friend_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friend" ADD CONSTRAINT "_Friend_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FriendRequests" ADD CONSTRAINT "_FriendRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FriendRequests" ADD CONSTRAINT "_FriendRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
