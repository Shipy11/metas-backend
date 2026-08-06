-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "productsOrServices" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- DropEnum
DROP TYPE "CompnayRole";

-- CreateTable
CREATE TABLE "FinancialRecord" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(15,2) NOT NULL,
    "expenses" DECIMAL(15,2) NOT NULL,
    "companyValuation" DECIMAL(15,2),
    "createdById" INTEGER NOT NULL,
    "lastUpdatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_lastUpdatedById_fkey" FOREIGN KEY ("lastUpdatedById") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
