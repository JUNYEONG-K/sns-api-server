-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'COMPLETED', 'DELETED');

-- CreateTable
CREATE TABLE "MediaContents" (
    "id" SERIAL NOT NULL,
    "type" "MediaType" NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "MediaContents_pkey" PRIMARY KEY ("id")
);
