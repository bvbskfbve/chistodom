CREATE TABLE "CompanySettings" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "name" TEXT NOT NULL DEFAULT 'ЧистоДом',
  "city" TEXT NOT NULL DEFAULT '',
  "territory" TEXT NOT NULL DEFAULT '',
  "phone" TEXT NOT NULL DEFAULT '',
  "whatsapp" TEXT NOT NULL DEFAULT '',
  "accent" TEXT NOT NULL DEFAULT '#668477',
  "prices" JSONB NOT NULL,
  "gameMode" TEXT NOT NULL DEFAULT 'off',
  "bonusAmount" INTEGER NOT NULL DEFAULT 500,
  "bonusDays" INTEGER NOT NULL DEFAULT 30,
  "bonusMinimum" INTEGER NOT NULL DEFAULT 3000,
  "charactersEnabled" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CompanySettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "outsideCity" BOOLEAN NOT NULL DEFAULT false,
  "preferredDate" TEXT,
  "preferredTime" TEXT,
  "comment" TEXT NOT NULL DEFAULT '',
  "consentAt" TIMESTAMP(3) NOT NULL,
  "items" JSONB NOT NULL,
  "pricingSnapshot" JSONB NOT NULL,
  "knownSubtotal" INTEGER NOT NULL,
  "cleaningTotal" INTEGER NOT NULL,
  "travelFee" INTEGER NOT NULL,
  "estimateTotal" INTEGER,
  "finalPrice" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'new',
  "privateNote" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderPhoto" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderPhoto_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderHistory" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "detail" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminSession" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminCredential" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "passwordHash" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminCredential_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Order_tokenHash_key" ON "Order"("tokenHash");
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE INDEX "Order_phone_idx" ON "Order"("phone");
CREATE UNIQUE INDEX "OrderPhoto_storageKey_key" ON "OrderPhoto"("storageKey");
CREATE INDEX "OrderPhoto_orderId_idx" ON "OrderPhoto"("orderId");
CREATE INDEX "OrderHistory_orderId_createdAt_idx" ON "OrderHistory"("orderId", "createdAt");
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

ALTER TABLE "OrderPhoto" ADD CONSTRAINT "OrderPhoto_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
