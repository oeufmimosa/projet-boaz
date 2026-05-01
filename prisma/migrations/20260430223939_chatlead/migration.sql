-- CreateTable
CREATE TABLE "ChatLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answers" TEXT NOT NULL,
    "postalCode" TEXT,
    "city" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "convertedToQuoteId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ChatLead_createdAt_idx" ON "ChatLead"("createdAt");

-- CreateIndex
CREATE INDEX "ChatLead_completed_idx" ON "ChatLead"("completed");
