/*
  Warnings:

  - The `status` column on the `PurchaseRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[code]` on the table `PurchaseRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `items` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `justification` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "items" JSONB NOT NULL,
ADD COLUMN     "justification" TEXT NOT NULL,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseRequest_code_key" ON "PurchaseRequest"("code");
