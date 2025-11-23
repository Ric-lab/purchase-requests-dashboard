-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "categories" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_cnpj_key" ON "suppliers"("cnpj");

-- Enable Row Level Security
ALTER TABLE "suppliers" ENABLE ROW LEVEL SECURITY;

-- Create Policy for SELECT (Read)
-- Users can see records that are NOT deleted
CREATE POLICY "Enable read access for authenticated users" ON "suppliers"
    FOR SELECT
    USING ("deletedAt" IS NULL);

-- Create Policy for INSERT (Create)
-- Authenticated users can insert
CREATE POLICY "Enable insert access for authenticated users" ON "suppliers"
    FOR INSERT
    WITH CHECK (true);

-- Create Policy for UPDATE (Update & Soft Delete)
-- Authenticated users can update
CREATE POLICY "Enable update access for authenticated users" ON "suppliers"
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- NOTE: We do NOT create a DELETE policy because we use Soft Delete (UPDATE).
-- Physical DELETE is disabled by default for RLS if no policy exists.

