-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
