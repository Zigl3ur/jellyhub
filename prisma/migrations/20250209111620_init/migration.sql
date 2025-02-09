-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jellydata" (
    "id" SERIAL NOT NULL,
    "accountid" INTEGER NOT NULL,
    "server" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,

    CONSTRAINT "jellydata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- AddForeignKey
ALTER TABLE "jellydata" ADD CONSTRAINT "jellydata_accountid_fkey" FOREIGN KEY ("accountid") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
