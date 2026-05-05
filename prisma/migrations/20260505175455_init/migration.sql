-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "draftValue" TEXT,
    "draftUpdatedAt" TIMESTAMP(3),
    "draftUpdatedBy" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "blurDataURL" TEXT,
    "variants" TEXT,
    "draftFilename" TEXT,
    "draftUrl" TEXT,
    "draftWidth" INTEGER,
    "draftHeight" INTEGER,
    "draftBlurDataURL" TEXT,
    "draftVariants" TEXT,
    "draftUpdatedAt" TIMESTAMP(3),
    "draftUpdatedBy" TEXT,
    "attribution" TEXT,
    "attributionUrl" TEXT,
    "licenseType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleInlineImage" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "caption" TEXT,
    "placeholderToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleInlineImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "key" TEXT,
    "before" TEXT,
    "after" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulatorStep" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "helpText" TEXT,
    "fieldType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "options" TEXT,
    "config" TEXT,
    "illustrationKey" TEXT,
    "encouragement" TEXT,
    "helpTooltip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulatorStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorCity" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "context" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatLead" (
    "id" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "postalCode" TEXT,
    "city" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "convertedToQuoteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "email" TEXT,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "sponsorTitle" TEXT,
    "sponsorLastName" TEXT NOT NULL,
    "sponsorFirstName" TEXT NOT NULL,
    "sponsorEmail" TEXT NOT NULL,
    "sponsorPhone" TEXT,
    "refereeFirstName" TEXT NOT NULL,
    "refereeLastName" TEXT NOT NULL,
    "refereeEmail" TEXT,
    "refereePhone" TEXT,
    "refereePostalCode" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "message" TEXT,
    "consentGiven" BOOLEAN NOT NULL,
    "consentTimestamp" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rewardAmount" INTEGER,
    "rewardPaidAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "adminEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "sponsorEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "refereeEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailErrors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Content_key_key" ON "Content"("key");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_key_key" ON "MediaAsset"("key");

-- CreateIndex
CREATE INDEX "ArticleInlineImage_articleId_idx" ON "ArticleInlineImage"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleInlineImage_articleId_position_key" ON "ArticleInlineImage"("articleId", "position");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_adminEmail_idx" ON "AuditLog"("adminEmail");

-- CreateIndex
CREATE UNIQUE INDEX "SimulatorStep_order_key" ON "SimulatorStep"("order");

-- CreateIndex
CREATE UNIQUE INDEX "SimulatorStep_key_key" ON "SimulatorStep"("key");

-- CreateIndex
CREATE INDEX "Testimonial_active_order_idx" ON "Testimonial"("active", "order");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_published_publishedAt_idx" ON "Article"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "ChatLead_createdAt_idx" ON "ChatLead"("createdAt");

-- CreateIndex
CREATE INDEX "ChatLead_completed_idx" ON "ChatLead"("completed");

-- CreateIndex
CREATE INDEX "LoginAttempt_ip_createdAt_idx" ON "LoginAttempt"("ip", "createdAt");

-- CreateIndex
CREATE INDEX "Referral_status_createdAt_idx" ON "Referral"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Referral_sponsorEmail_idx" ON "Referral"("sponsorEmail");

-- CreateIndex
CREATE INDEX "Referral_refereeEmail_idx" ON "Referral"("refereeEmail");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleInlineImage" ADD CONSTRAINT "ArticleInlineImage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleInlineImage" ADD CONSTRAINT "ArticleInlineImage_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
