-- AlterTable: Combine firstName and lastName into fullName
-- First, add the new column
ALTER TABLE "individual_profiles" ADD COLUMN "fullName" TEXT;

-- Migrate existing data: combine firstName and lastName
UPDATE "individual_profiles" 
SET "fullName" = TRIM(CONCAT(COALESCE("firstName", ''), ' ', COALESCE("lastName", '')))
WHERE "firstName" IS NOT NULL OR "lastName" IS NOT NULL;

-- Drop old columns
ALTER TABLE "individual_profiles" DROP COLUMN "firstName";
ALTER TABLE "individual_profiles" DROP COLUMN "lastName";
