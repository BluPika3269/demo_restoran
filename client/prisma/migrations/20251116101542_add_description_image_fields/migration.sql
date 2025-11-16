/*
  Warnings:

  - You are about to drop the column `type` on the `service_categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_categories" DROP COLUMN "type",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;
