/*
  Warnings:

  - Added the required column `name` to the `MediaContents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `MediaContents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MediaContents" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
