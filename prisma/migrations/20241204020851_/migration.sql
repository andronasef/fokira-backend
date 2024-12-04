-- DropIndex
DROP INDEX "Post_authorId_idx";

-- DropIndex
DROP INDEX "Slide_order_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "Slide" ALTER COLUMN "content" SET DATA TYPE TEXT;
