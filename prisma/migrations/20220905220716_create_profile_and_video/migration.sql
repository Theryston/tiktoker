-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "rawPath" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "quickLaughsUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "videos_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_path_key" ON "profiles"("path");

-- CreateIndex
CREATE UNIQUE INDEX "videos_path_key" ON "videos"("path");

-- CreateIndex
CREATE UNIQUE INDEX "videos_rawPath_key" ON "videos"("rawPath");
