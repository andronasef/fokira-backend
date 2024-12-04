/*
  Warnings:

  - You are about to alter the column `content` on the `Slide` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "title" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Slide" ALTER COLUMN "content" SET DATA TYPE VARCHAR(150);

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Slide_order_idx" ON "Slide"("order");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
