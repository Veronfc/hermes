-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;
