-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_address_key" ON "profile"("address");
