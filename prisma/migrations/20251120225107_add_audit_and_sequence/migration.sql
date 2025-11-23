-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "sequenceId" SERIAL NOT NULL,
ALTER COLUMN "code" DROP NOT NULL;
