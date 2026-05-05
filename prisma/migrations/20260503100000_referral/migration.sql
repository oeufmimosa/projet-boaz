-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "consentTimestamp" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rewardAmount" INTEGER,
    "rewardPaidAt" DATETIME,
    "internalNotes" TEXT,
    "adminEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "sponsorEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "refereeEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailErrors" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Referral_status_createdAt_idx" ON "Referral"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Referral_sponsorEmail_idx" ON "Referral"("sponsorEmail");

-- CreateIndex
CREATE INDEX "Referral_refereeEmail_idx" ON "Referral"("refereeEmail");
