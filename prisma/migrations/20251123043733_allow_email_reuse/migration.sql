-- Drop the existing unique constraint on email
DROP INDEX IF EXISTS "employees_email_key";

-- Create a partial unique index that only enforces uniqueness for non-deleted employees
CREATE UNIQUE INDEX "employees_email_active_key" ON "employees"("email") WHERE "deletedAt" IS NULL;
