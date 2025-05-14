/*
  Warnings:

  - You are about to drop the column `last_sent_at` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "last_sent_at";
