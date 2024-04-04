-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'COMPLETED', 'DELETED');

-- CreateTable
CREATE TABLE "media_contents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "media_contents_pkey" PRIMARY KEY ("id")
);
