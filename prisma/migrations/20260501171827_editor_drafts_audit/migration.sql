-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN "blurDataURL" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "draftBlurDataURL" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "draftFilename" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "draftHeight" INTEGER;
ALTER TABLE "MediaAsset" ADD COLUMN "draftUpdatedAt" DATETIME;
ALTER TABLE "MediaAsset" ADD COLUMN "draftUpdatedBy" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "draftUrl" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "draftVariants" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "draftWidth" INTEGER;
ALTER TABLE "MediaAsset" ADD COLUMN "height" INTEGER;
ALTER TABLE "MediaAsset" ADD COLUMN "variants" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "width" INTEGER;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "key" TEXT,
    "before" TEXT,
    "after" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "draftValue" TEXT,
    "draftUpdatedAt" DATETIME,
    "draftUpdatedBy" TEXT,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Content" ("id", "key", "type", "updatedAt", "value") SELECT "id", "key", "type", "updatedAt", "value" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_key_key" ON "Content"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_adminEmail_idx" ON "AuditLog"("adminEmail");
