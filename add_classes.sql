-- Migration: AddClasses
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "Classes" (
    "Id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
    "Name"            character varying(200)   NOT NULL,
    "Description"     character varying(1000),
    "Instructor"      character varying(100)   NOT NULL,
    "MaxCapacity"     integer                  NOT NULL,
    "DurationMinutes" integer                  NOT NULL,
    "Price"           numeric(10,2)            NOT NULL,
    "ColorLabel"      character varying(20)    NOT NULL DEFAULT '#f9a8d4',
    "Category"        character varying(100),
    "IsActive"        boolean                  NOT NULL DEFAULT true,
    "CreatedAt"       timestamp with time zone NOT NULL DEFAULT now(),
    "UpdatedAt"       timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_Classes" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "ClassSessions" (
    "Id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
    "ClassId"           uuid                     NOT NULL,
    "StartTime"         timestamp with time zone NOT NULL,
    "Status"            character varying(20)    NOT NULL DEFAULT 'Scheduled',
    "CurrentEnrollment" integer                  NOT NULL DEFAULT 0,
    "Notes"             character varying(500),
    "CreatedAt"         timestamp with time zone NOT NULL DEFAULT now(),
    "UpdatedAt"         timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_ClassSessions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ClassSessions_Classes_ClassId"
        FOREIGN KEY ("ClassId") REFERENCES "Classes"("Id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IX_ClassSessions_ClassId"   ON "ClassSessions" ("ClassId");
CREATE INDEX IF NOT EXISTS "IX_ClassSessions_StartTime" ON "ClassSessions" ("StartTime");
