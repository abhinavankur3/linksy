-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "avatarPath" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "ungroupedPosition" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("avatarPath", "bio", "createdAt", "displayName", "id", "slug", "theme", "updatedAt", "userId") SELECT "avatarPath", "bio", "createdAt", "displayName", "id", "slug", "theme", "updatedAt", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
