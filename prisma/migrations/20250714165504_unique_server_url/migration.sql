/*
  Warnings:

  - A unique constraint covering the columns `[serverUrl]` on the table `jellydata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jellydata_serverUrl_key" ON "jellydata"("serverUrl");
