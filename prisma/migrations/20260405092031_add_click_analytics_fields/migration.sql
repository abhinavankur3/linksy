-- AlterTable
ALTER TABLE "Click" ADD COLUMN "browser" TEXT;
ALTER TABLE "Click" ADD COLUMN "browserVersion" TEXT;
ALTER TABLE "Click" ADD COLUMN "country" TEXT;
ALTER TABLE "Click" ADD COLUMN "deviceType" TEXT;
ALTER TABLE "Click" ADD COLUMN "language" TEXT;
ALTER TABLE "Click" ADD COLUMN "os" TEXT;
ALTER TABLE "Click" ADD COLUMN "osVersion" TEXT;
ALTER TABLE "Click" ADD COLUMN "referrer" TEXT;
ALTER TABLE "Click" ADD COLUMN "referrerDomain" TEXT;
ALTER TABLE "Click" ADD COLUMN "userAgent" TEXT;
ALTER TABLE "Click" ADD COLUMN "utmCampaign" TEXT;
ALTER TABLE "Click" ADD COLUMN "utmMedium" TEXT;
ALTER TABLE "Click" ADD COLUMN "utmSource" TEXT;

-- CreateIndex
CREATE INDEX "Click_clickedAt_idx" ON "Click"("clickedAt");
