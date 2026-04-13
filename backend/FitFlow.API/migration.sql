CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "Email" character varying(256) NOT NULL,
        "Name" character varying(100) NOT NULL,
        "PasswordHash" text NOT NULL,
        "Phone" character varying(20),
        "Role" character varying(20) NOT NULL,
        "IsActive" boolean NOT NULL DEFAULT TRUE,
        "RefreshToken" text,
        "RefreshTokenExpiry" timestamp with time zone,
        "ProfileImageUrl" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE TABLE "NutritionLogs" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "Date" date NOT NULL,
        "TotalCalories" numeric(8,2) NOT NULL,
        "TotalProteinG" numeric(8,2) NOT NULL,
        "TotalCarbsG" numeric(8,2) NOT NULL,
        "TotalFatG" numeric(8,2) NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_NutritionLogs" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_NutritionLogs_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE TABLE "Workouts" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "Name" character varying(200) NOT NULL,
        "Description" text,
        "ScheduledAt" timestamp with time zone,
        "CompletedAt" timestamp with time zone,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Workouts" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Workouts_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE TABLE "Meals" (
        "Id" uuid NOT NULL,
        "NutritionLogId" uuid NOT NULL,
        "Name" character varying(200) NOT NULL,
        "Calories" numeric(8,2) NOT NULL,
        "ProteinG" numeric(8,2) NOT NULL,
        "CarbsG" numeric(8,2) NOT NULL,
        "FatG" numeric(8,2) NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Meals" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Meals_NutritionLogs_NutritionLogId" FOREIGN KEY ("NutritionLogId") REFERENCES "NutritionLogs" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE TABLE "WorkoutExercises" (
        "Id" uuid NOT NULL,
        "WorkoutId" uuid NOT NULL,
        "Name" character varying(200) NOT NULL,
        "Sets" integer NOT NULL,
        "Reps" integer NOT NULL,
        "WeightKg" numeric(6,2),
        "DurationSeconds" integer,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_WorkoutExercises" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_WorkoutExercises_Workouts_WorkoutId" FOREIGN KEY ("WorkoutId") REFERENCES "Workouts" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE INDEX "IX_Meals_NutritionLogId" ON "Meals" ("NutritionLogId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE INDEX "IX_NutritionLogs_UserId" ON "NutritionLogs" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE INDEX "IX_WorkoutExercises_WorkoutId" ON "WorkoutExercises" ("WorkoutId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    CREATE INDEX "IX_Workouts_UserId" ON "Workouts" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260413172328_InitialAuth') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260413172328_InitialAuth', '9.0.4');
    END IF;
END $EF$;
COMMIT;

