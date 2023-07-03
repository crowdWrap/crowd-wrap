-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registerdWith" TEXT,
ADD COLUMN     "usernameSet" BOOLEAN NOT NULL DEFAULT false;
