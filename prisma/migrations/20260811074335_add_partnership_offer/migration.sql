-- CreateEnum
CREATE TYPE "EquityOfferType" AS ENUM ('NEW_EQUITY', 'STAKE_TRANSFER');

-- CreateEnum
CREATE TYPE "PartnershipOfferStatus" AS ENUM ('OPEN', 'PARTIALLY_FUNDED', 'FUNDED', 'CLOSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "CompanyMember" ADD COLUMN     "ownershipPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PartnershipOffer" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fundingGoal" DECIMAL(15,2) NOT NULL,
    "fundingRaised" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "equityPercentage" DECIMAL(5,2) NOT NULL,
    "minimumInvestment" DECIMAL(15,2),
    "purpose" TEXT,
    "offerType" "EquityOfferType" NOT NULL,
    "status" "PartnershipOfferStatus" NOT NULL DEFAULT 'OPEN',
    "expiresAt" TIMESTAMP(3),
    "createdById" INTEGER NOT NULL,
    "lastUpdatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnershipOffer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartnershipOffer" ADD CONSTRAINT "PartnershipOffer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipOffer" ADD CONSTRAINT "PartnershipOffer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipOffer" ADD CONSTRAINT "PartnershipOffer_lastUpdatedById_fkey" FOREIGN KEY ("lastUpdatedById") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
