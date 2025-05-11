/*
  Warnings:

  - Made the column `updated_at` on table `conversations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "updated_at" SET NOT NULL;
