/*
  Warnings:

  - You are about to drop the column `color` on the `Team` table. All the data in the column will be lost.
  - Added the required column `primaryColor` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondartColor` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "color",
ADD COLUMN     "primaryColor" TEXT NOT NULL,
ADD COLUMN     "secondartColor" TEXT NOT NULL;
