-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'invited',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'other';
