-- DropForeignKey
ALTER TABLE "jellydata" DROP CONSTRAINT "jellydata_userId_fkey";

-- DropIndex
DROP INDEX "jellydata_userId_key";

-- AlterTable
ALTER TABLE "jellydata" ADD CONSTRAINT "jellydata_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN,
ADD COLUMN     "role" TEXT;

-- AddForeignKey
ALTER TABLE "jellydata" ADD CONSTRAINT "jellydata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
