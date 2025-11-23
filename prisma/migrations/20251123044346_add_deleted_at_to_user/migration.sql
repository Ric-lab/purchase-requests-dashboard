-- Add deletedAt column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- Drop the existing unique constraint on email
DROP INDEX IF EXISTS "User_email_key";

-- Create a partial unique index that only enforces uniqueness for non-deleted users
CREATE UNIQUE INDEX "User_email_active_key" ON "User"("email") WHERE "deletedAt" IS NULL;
