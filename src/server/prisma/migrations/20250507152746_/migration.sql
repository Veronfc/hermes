-- CreateEnum
CREATE TYPE "Type" AS ENUM ('direct', 'group');

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'direct';
