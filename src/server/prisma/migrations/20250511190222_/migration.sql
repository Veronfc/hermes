-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "last_message" TEXT,
ADD COLUMN     "last_sent_at" TIMESTAMPTZ(3);
