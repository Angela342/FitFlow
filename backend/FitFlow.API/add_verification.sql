START TRANSACTION;
ALTER TABLE "Users" ADD "IsEmailVerified" boolean NOT NULL DEFAULT FALSE;

CREATE TABLE "VerificationCodes" (
    "Id" uuid NOT NULL,
    "Email" character varying(256) NOT NULL,
    "Code" character varying(6) NOT NULL,
    "Purpose" character varying(30) NOT NULL,
    "ExpiresAt" timestamp with time zone NOT NULL,
    "IsUsed" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_VerificationCodes" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_VerificationCodes_Email_Purpose" ON "VerificationCodes" ("Email", "Purpose");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260425175102_AddVerification', '9.0.4');

COMMIT;

