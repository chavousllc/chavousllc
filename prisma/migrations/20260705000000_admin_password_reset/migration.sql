-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resetTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_resetTokenHash_key" ON "AdminUser"("resetTokenHash");

