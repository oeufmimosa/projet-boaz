-- Add attribution columns to MediaAsset
ALTER TABLE "MediaAsset" ADD COLUMN "attribution" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "attributionUrl" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "licenseType" TEXT;

-- CreateTable ArticleInlineImage
CREATE TABLE "ArticleInlineImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "caption" TEXT,
    "placeholderToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleInlineImage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArticleInlineImage_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleInlineImage_articleId_position_key" ON "ArticleInlineImage"("articleId", "position");

-- CreateIndex
CREATE INDEX "ArticleInlineImage_articleId_idx" ON "ArticleInlineImage"("articleId");
