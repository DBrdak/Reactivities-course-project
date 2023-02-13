CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;

CREATE TABLE "Activities" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Activities" PRIMARY KEY,
    "Title" TEXT NULL,
    "Date" TEXT NOT NULL,
    "Description" TEXT NULL,
    "Category" TEXT NULL,
    "City" TEXT NULL,
    "Venue" TEXT NULL
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230113201317_Init', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Activities" ADD "AccessFailedCount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Activities" ADD "ConcurrencyStamp" TEXT NULL;

ALTER TABLE "Activities" ADD "Email" TEXT NULL;

ALTER TABLE "Activities" ADD "EmailConfirmed" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Activities" ADD "LockoutEnabled" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Activities" ADD "LockoutEnd" TEXT NULL;

ALTER TABLE "Activities" ADD "NormalizedEmail" TEXT NULL;

ALTER TABLE "Activities" ADD "NormalizedUserName" TEXT NULL;

ALTER TABLE "Activities" ADD "PasswordHash" TEXT NULL;

ALTER TABLE "Activities" ADD "PhoneNumber" TEXT NULL;

ALTER TABLE "Activities" ADD "PhoneNumberConfirmed" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Activities" ADD "SecurityStamp" TEXT NULL;

ALTER TABLE "Activities" ADD "TwoFactorEnabled" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Activities" ADD "UserName" TEXT NULL;

CREATE TABLE "AspNetRoles" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_AspNetRoles" PRIMARY KEY,
    "Name" TEXT NULL,
    "NormalizedName" TEXT NULL,
    "ConcurrencyStamp" TEXT NULL
);

CREATE TABLE "AspNetUsers" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_AspNetUsers" PRIMARY KEY,
    "DisplayName" TEXT NULL,
    "Bio" TEXT NULL,
    "UserName" TEXT NULL,
    "NormalizedUserName" TEXT NULL,
    "Email" TEXT NULL,
    "NormalizedEmail" TEXT NULL,
    "EmailConfirmed" INTEGER NOT NULL,
    "PasswordHash" TEXT NULL,
    "SecurityStamp" TEXT NULL,
    "ConcurrencyStamp" TEXT NULL,
    "PhoneNumber" TEXT NULL,
    "PhoneNumberConfirmed" INTEGER NOT NULL,
    "TwoFactorEnabled" INTEGER NOT NULL,
    "LockoutEnd" TEXT NULL,
    "LockoutEnabled" INTEGER NOT NULL,
    "AccessFailedCount" INTEGER NOT NULL
);

CREATE TABLE "AspNetRoleClaims" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY AUTOINCREMENT,
    "RoleId" TEXT NOT NULL,
    "ClaimType" TEXT NULL,
    "ClaimValue" TEXT NULL,
    CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserClaims" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY AUTOINCREMENT,
    "UserId" TEXT NOT NULL,
    "ClaimType" TEXT NULL,
    "ClaimValue" TEXT NULL,
    CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserLogins" (
    "LoginProvider" TEXT NOT NULL,
    "ProviderKey" TEXT NOT NULL,
    "ProviderDisplayName" TEXT NULL,
    "UserId" TEXT NOT NULL,
    CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey"),
    CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserRoles" (
    "UserId" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,
    CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId"),
    CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserTokens" (
    "UserId" TEXT NOT NULL,
    "LoginProvider" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Value" TEXT NULL,
    CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name"),
    CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" ("RoleId");

CREATE UNIQUE INDEX "RoleNameIndex" ON "AspNetRoles" ("NormalizedName");

CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" ("UserId");

CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" ("UserId");

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" ("RoleId");

CREATE INDEX "EmailIndex" ON "AspNetUsers" ("NormalizedEmail");

CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers" ("NormalizedUserName");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230123235623_IdentityAdded', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "ActivityAppUser" (
    "ActivitiesId" TEXT NOT NULL,
    "AttendeesId" TEXT NOT NULL,
    CONSTRAINT "PK_ActivityAppUser" PRIMARY KEY ("ActivitiesId", "AttendeesId"),
    CONSTRAINT "FK_ActivityAppUser_Activities_ActivitiesId" FOREIGN KEY ("ActivitiesId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ActivityAppUser_AspNetUsers_AttendeesId" FOREIGN KEY ("AttendeesId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_ActivityAppUser_AttendeesId" ON "ActivityAppUser" ("AttendeesId");

CREATE TABLE "ef_temp_Activities" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Activities" PRIMARY KEY,
    "Category" TEXT NULL,
    "City" TEXT NULL,
    "Date" TEXT NOT NULL,
    "Description" TEXT NULL,
    "Title" TEXT NULL,
    "Venue" TEXT NULL
);

INSERT INTO "ef_temp_Activities" ("Id", "Category", "City", "Date", "Description", "Title", "Venue")
SELECT "Id", "Category", "City", "Date", "Description", "Title", "Venue"
FROM "Activities";

COMMIT;

PRAGMA foreign_keys = 0;

BEGIN TRANSACTION;

DROP TABLE "Activities";

ALTER TABLE "ef_temp_Activities" RENAME TO "Activities";

COMMIT;

PRAGMA foreign_keys = 1;

BEGIN TRANSACTION;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230203135232_ActivityAtendee', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

DROP TABLE "ActivityAppUser";

CREATE TABLE "ActivitiesAtendees" (
    "AppUserId" TEXT NOT NULL,
    "ActivityId" TEXT NOT NULL,
    "IsHost" INTEGER NOT NULL,
    CONSTRAINT "PK_ActivitiesAtendees" PRIMARY KEY ("AppUserId", "ActivityId"),
    CONSTRAINT "FK_ActivitiesAtendees_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ActivitiesAtendees_AspNetUsers_AppUserId" FOREIGN KEY ("AppUserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_ActivitiesAtendees_ActivityId" ON "ActivitiesAtendees" ("ActivityId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230203140512_ActivityAtendee02', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Activities" ADD "IsCancelled" INTEGER NOT NULL DEFAULT 0;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230203151814_AddCancelledProp', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "Photo" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Photo" PRIMARY KEY,
    "Url" TEXT NULL,
    "IsMain" INTEGER NOT NULL,
    "AppUserId" TEXT NULL,
    CONSTRAINT "FK_Photo_AspNetUsers_AppUserId" FOREIGN KEY ("AppUserId") REFERENCES "AspNetUsers" ("Id")
);

CREATE INDEX "IX_Photo_AppUserId" ON "Photo" ("AppUserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230206222310_PhotoDbSet', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Photo" RENAME TO "Photos";

DROP INDEX "IX_Photo_AppUserId";

CREATE INDEX "IX_Photos_AppUserId" ON "Photos" ("AppUserId");

CREATE TABLE "ef_temp_Photos" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Photos" PRIMARY KEY,
    "AppUserId" TEXT NULL,
    "IsMain" INTEGER NOT NULL,
    "Url" TEXT NULL,
    CONSTRAINT "FK_Photos_AspNetUsers_AppUserId" FOREIGN KEY ("AppUserId") REFERENCES "AspNetUsers" ("Id")
);

INSERT INTO "ef_temp_Photos" ("Id", "AppUserId", "IsMain", "Url")
SELECT "Id", "AppUserId", "IsMain", "Url"
FROM "Photos";

COMMIT;

PRAGMA foreign_keys = 0;

BEGIN TRANSACTION;

DROP TABLE "Photos";

ALTER TABLE "ef_temp_Photos" RENAME TO "Photos";

COMMIT;

PRAGMA foreign_keys = 1;

BEGIN TRANSACTION;

CREATE INDEX "IX_Photos_AppUserId" ON "Photos" ("AppUserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230206224354_PhotoDbSet02', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "Comment" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Comment" PRIMARY KEY AUTOINCREMENT,
    "Body" TEXT NULL,
    "AuthorId" TEXT NULL,
    "ActivityId" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "FK_Comment_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id"),
    CONSTRAINT "FK_Comment_AspNetUsers_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES "AspNetUsers" ("Id")
);

CREATE INDEX "IX_Comment_ActivityId" ON "Comment" ("ActivityId");

CREATE INDEX "IX_Comment_AuthorId" ON "Comment" ("AuthorId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230210173133_CommentEntityAdded', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

ALTER TABLE "Comment" RENAME TO "Comments";

DROP INDEX "IX_Comment_AuthorId";

CREATE INDEX "IX_Comments_AuthorId" ON "Comments" ("AuthorId");

DROP INDEX "IX_Comment_ActivityId";

CREATE INDEX "IX_Comments_ActivityId" ON "Comments" ("ActivityId");

CREATE TABLE "ef_temp_Comments" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Comments" PRIMARY KEY AUTOINCREMENT,
    "ActivityId" TEXT NULL,
    "AuthorId" TEXT NULL,
    "Body" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "FK_Comments_Activities_ActivityId" FOREIGN KEY ("ActivityId") REFERENCES "Activities" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Comments_AspNetUsers_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES "AspNetUsers" ("Id")
);

INSERT INTO "ef_temp_Comments" ("Id", "ActivityId", "AuthorId", "Body", "CreatedAt")
SELECT "Id", "ActivityId", "AuthorId", "Body", "CreatedAt"
FROM "Comments";

COMMIT;

PRAGMA foreign_keys = 0;

BEGIN TRANSACTION;

DROP TABLE "Comments";

ALTER TABLE "ef_temp_Comments" RENAME TO "Comments";

COMMIT;

PRAGMA foreign_keys = 1;

BEGIN TRANSACTION;

CREATE INDEX "IX_Comments_ActivityId" ON "Comments" ("ActivityId");

CREATE INDEX "IX_Comments_AuthorId" ON "Comments" ("AuthorId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230212135843_CommentsAdded02', '7.0.2');

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE "UserFollowings" (
    "ObserverId" TEXT NOT NULL,
    "TargetId" TEXT NOT NULL,
    CONSTRAINT "PK_UserFollowings" PRIMARY KEY ("ObserverId", "TargetId"),
    CONSTRAINT "FK_UserFollowings_AspNetUsers_ObserverId" FOREIGN KEY ("ObserverId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserFollowings_AspNetUsers_TargetId" FOREIGN KEY ("TargetId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_UserFollowings_TargetId" ON "UserFollowings" ("TargetId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230213152419_FollowingEntityAdded', '7.0.2');

COMMIT;

