-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('DRY_VAN', 'FTL', 'PARTIAL_TRUCKLOAD', 'LTL', 'EXPEDITED', 'DEDICATED_LANES', 'DISPATCH_TRACKING');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'REVIEWED', 'CONTACTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('DRY_VAN', 'REEFER', 'FLATBED', 'EXPEDITED');

-- CreateEnum
CREATE TYPE "LoadType" AS ENUM ('FTL', 'LTL');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "companyName" TEXT NOT NULL DEFAULT 'Chavous Transportation LLC',
    "heroHeadline" TEXT NOT NULL DEFAULT 'Reliable Freight Transportation, Coast to Coast',
    "heroSubtext" TEXT NOT NULL DEFAULT 'Chavous Transportation LLC moves freight across the continental United States with a modern fleet and a safety-first team you can count on.',
    "aboutText" TEXT NOT NULL DEFAULT 'Chavous Transportation LLC is a mid-size carrier built on reliability, safety, and communication. Our team of experienced drivers and dispatchers works around the clock to keep your freight moving on time, every time.',
    "foundingYear" INTEGER NOT NULL DEFAULT 2016,
    "fleetSize" INTEGER NOT NULL DEFAULT 35,
    "dotNumber" TEXT NOT NULL DEFAULT 'U.S. DOT# 3872584',
    "mcNumber" TEXT NOT NULL DEFAULT 'MC-1418287-C',
    "phone" TEXT NOT NULL DEFAULT '+1 (513) 988-7357',
    "email" TEXT NOT NULL DEFAULT 'dispatch@chavousllc.com',
    "dispatchHours" TEXT NOT NULL DEFAULT '8:00 AM – 5:00 PM EST',
    "address" TEXT NOT NULL DEFAULT '1112 Harper Dr, Warminster, PA 18974',
    "coverageStates" TEXT[] DEFAULT ARRAY['AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'truck',
    "category" "ServiceCategory" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverApplication" (
    "id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "positionAppliedFor" TEXT NOT NULL,
    "availabilityDate" TIMESTAMP(3) NOT NULL,
    "desiredRoutes" TEXT NOT NULL,
    "willingToTravel" BOOLEAN NOT NULL DEFAULT true,
    "eligibleToWork" BOOLEAN NOT NULL DEFAULT true,
    "cdlNumber" TEXT NOT NULL,
    "cdlState" TEXT NOT NULL,
    "cdlClass" TEXT NOT NULL,
    "cdlEndorsements" TEXT NOT NULL DEFAULT '',
    "cdlExpiration" TIMESTAMP(3) NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "equipmentOperated" TEXT NOT NULL,
    "employmentHistory" TEXT NOT NULL,
    "hadAccidents" BOOLEAN NOT NULL,
    "accidentsExplain" TEXT NOT NULL DEFAULT '',
    "hadViolations" BOOLEAN NOT NULL,
    "violationsExplain" TEXT NOT NULL DEFAULT '',
    "references" TEXT NOT NULL,
    "consentBackgroundCheck" BOOLEAN NOT NULL,
    "signatureName" TEXT NOT NULL,
    "signatureDate" TIMESTAMP(3) NOT NULL,
    "pdfData" BYTEA,
    "pdfFileName" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "shipperCompany" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "originState" TEXT NOT NULL,
    "destCity" TEXT NOT NULL,
    "destState" TEXT NOT NULL,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "equipmentType" "EquipmentType" NOT NULL,
    "loadType" "LoadType" NOT NULL,
    "weight" INTEGER NOT NULL,
    "commodity" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

