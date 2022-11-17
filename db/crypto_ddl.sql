-- public."DeviceKey" definition

-- Drop table

-- DROP TABLE public."DeviceKey";

CREATE TABLE public."DeviceKey" (
	id serial4 NOT NULL,
	"userId" text NULL,
	"deviceId" text NOT NULL,
	"keyId" text NOT NULL,
	"publicKey" text NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "DeviceKey_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "DeviceKey_deviceId_key" ON public."DeviceKey" USING btree ("deviceId");
CREATE INDEX "DeviceKey_keyId_idx" ON public."DeviceKey" USING btree ("keyId");
CREATE INDEX "DeviceKey_userId_idx" ON public."DeviceKey" USING btree ("userId");
