
-- CreateEnum
CREATE TYPE "DriverType" AS ENUM ('COMPANY_DRIVER', 'OWNER_OPERATOR', 'LEASED_OPERATOR');

-- CreateEnum
CREATE TYPE "ApplicationDocumentType" AS ENUM ('CDL_FRONT', 'CDL_BACK', 'MEDICAL_CARD', 'OTHER');

-- AlterTable
ALTER TABLE "DriverApplication" ADD COLUMN     "applicationCode" TEXT NOT NULL,
ADD COLUMN     "bankAccountNumberEncrypted" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bankRoutingNumber" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "driverType" "DriverType",
ADD COLUMN     "resumeTokenHash" TEXT,
ADD COLUMN     "ssnEncrypted" TEXT,
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "zip" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "positionAppliedFor" DROP NOT NULL,
ALTER COLUMN "availabilityDate" DROP NOT NULL,
ALTER COLUMN "desiredRoutes" DROP NOT NULL,
ALTER COLUMN "willingToTravel" DROP NOT NULL,
ALTER COLUMN "eligibleToWork" DROP NOT NULL,
ALTER COLUMN "cdlNumber" DROP NOT NULL,
ALTER COLUMN "cdlState" DROP NOT NULL,
ALTER COLUMN "cdlClass" DROP NOT NULL,
ALTER COLUMN "cdlEndorsements" DROP NOT NULL,
ALTER COLUMN "cdlExpiration" DROP NOT NULL,
ALTER COLUMN "yearsExperience" DROP NOT NULL,
ALTER COLUMN "equipmentOperated" DROP NOT NULL,
ALTER COLUMN "employmentHistory" DROP NOT NULL,
ALTER COLUMN "hadAccidents" DROP NOT NULL,
ALTER COLUMN "accidentsExplain" DROP NOT NULL,
ALTER COLUMN "hadViolations" DROP NOT NULL,
ALTER COLUMN "violationsExplain" DROP NOT NULL,
ALTER COLUMN "references" DROP NOT NULL,
ALTER COLUMN "consentBackgroundCheck" DROP NOT NULL,
ALTER COLUMN "signatureName" DROP NOT NULL,
ALTER COLUMN "signatureDate" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ApplicationDocument" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "ApplicationDocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationDocument_applicationId_idx" ON "ApplicationDocument"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverApplication_applicationCode_key" ON "DriverApplication"("applicationCode");

-- CreateIndex
CREATE UNIQUE INDEX "DriverApplication_resumeTokenHash_key" ON "DriverApplication"("resumeTokenHash");

-- AddForeignKey
ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "DriverApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

