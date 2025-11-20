/*
  Warnings:

  - You are about to drop the column `priority` on the `PurchaseRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseRequest" DROP COLUMN "priority";

-- DropEnum
DROP TYPE "Priority";
