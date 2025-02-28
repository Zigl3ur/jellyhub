/*
  Warnings:

  - A unique constraint covering the columns `[accountid,server]` on the table `jellydata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jellydata_accountid_server_key" ON "jellydata"("accountid", "server");
