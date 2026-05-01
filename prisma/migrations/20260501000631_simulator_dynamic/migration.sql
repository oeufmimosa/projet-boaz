-- AlterTable
ALTER TABLE "SimulatorStep" ADD COLUMN "encouragement" TEXT;
ALTER TABLE "SimulatorStep" ADD COLUMN "helpTooltip" TEXT;
ALTER TABLE "SimulatorStep" ADD COLUMN "illustrationKey" TEXT;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorCity" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "context" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Testimonial_active_order_idx" ON "Testimonial"("active", "order");
