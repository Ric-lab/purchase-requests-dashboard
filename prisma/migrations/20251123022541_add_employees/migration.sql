-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "access_level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- Enable Row Level Security
ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;

-- Create Policy for SELECT (Read)
-- Users can see records that are NOT deleted
CREATE POLICY "Enable read access for authenticated users" ON "employees"
    FOR SELECT
    USING ("deletedAt" IS NULL);

-- Create Policy for INSERT (Create)
-- Authenticated users can insert
CREATE POLICY "Enable insert access for authenticated users" ON "employees"
    FOR INSERT
    WITH CHECK (true);

-- Create Policy for UPDATE (Update & Soft Delete)
-- Authenticated users can update
CREATE POLICY "Enable update access for authenticated users" ON "employees"
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

