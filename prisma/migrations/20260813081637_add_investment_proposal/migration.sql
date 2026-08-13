-- CreateEnum
CREATE TYPE "InvestmentProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "PartnershipOffer" ADD COLUMN     "equityCommitted" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "InvestmentProposal" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "offerId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "investmentAmount" DECIMAL(15,2) NOT NULL,
    "requestedEquity" DECIMAL(5,2) NOT NULL,
    "message" TEXT,
    "status" "InvestmentProposalStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvestmentProposal_companyId_idx" ON "InvestmentProposal"("companyId");

-- CreateIndex
CREATE INDEX "InvestmentProposal_offerId_idx" ON "InvestmentProposal"("offerId");

-- CreateIndex
CREATE INDEX "InvestmentProposal_createdById_idx" ON "InvestmentProposal"("createdById");

-- CreateIndex
CREATE INDEX "InvestmentProposal_status_idx" ON "InvestmentProposal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentProposal_offerId_createdById_key" ON "InvestmentProposal"("offerId", "createdById");

-- CreateIndex
CREATE INDEX "PartnershipOffer_companyId_idx" ON "PartnershipOffer"("companyId");

-- AddForeignKey
ALTER TABLE "InvestmentProposal" ADD CONSTRAINT "InvestmentProposal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentProposal" ADD CONSTRAINT "InvestmentProposal_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "PartnershipOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentProposal" ADD CONSTRAINT "InvestmentProposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentProposal" ADD CONSTRAINT "InvestmentProposal_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
