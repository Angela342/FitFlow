START TRANSACTION;
CREATE TABLE "Studios" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Description" character varying(1000),
    "Address" character varying(500),
    "Phone" character varying(20),
    "Email" character varying(256),
    "Website" character varying(500),
    "LogoUrl" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Studios" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260413212913_AddStudio', '9.0.4');

COMMIT;

