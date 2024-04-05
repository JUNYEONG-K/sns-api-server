/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `hashtags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hashtags_tag_key" ON "hashtags"("tag");
