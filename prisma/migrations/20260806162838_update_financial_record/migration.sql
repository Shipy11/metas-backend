-- AlterTable
ALTER TABLE "FinancialRecord" ADD COLUMN     "cashBalance" DECIMAL(15,2),
ADD COLUMN     "totalAssets" DECIMAL(15,2),
ADD COLUMN     "totalDebt" DECIMAL(15,2) NOT NULL DEFAULT 0;
