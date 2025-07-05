/*
  Warnings:

  - You are about to drop the column `accountid` on the `jellydata` table. All the data in the column will be lost.
  - You are about to drop the column `server` on the `jellydata` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `jellydata` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `jellydata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `jellydata` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serverId` to the `jellydata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverToken` to the `jellydata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverUrl` to the `jellydata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverUsername` to the `jellydata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `jellydata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "jellydata" DROP CONSTRAINT "jellydata_accountid_fkey";

-- DropIndex
DROP INDEX "jellydata_accountid_key";

-- DropIndex
DROP INDEX "jellydata_accountid_server_key";

-- AlterTable
ALTER TABLE "jellydata" DROP COLUMN "accountid",
DROP COLUMN "server",
DROP COLUMN "token",
DROP COLUMN "username",
ADD COLUMN     "serverId" TEXT NOT NULL,
ADD COLUMN     "serverToken" TEXT NOT NULL,
ADD COLUMN     "serverUrl" TEXT NOT NULL,
ADD COLUMN     "serverUsername" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "displayUsername" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "jellydata_userId_key" ON "jellydata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "jellydata" ADD CONSTRAINT "jellydata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
