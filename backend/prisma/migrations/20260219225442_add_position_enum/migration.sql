/*
  Warnings:

  - Changed the type of `position` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GOALKEEPER', 'CENTER_BACK', 'RIGHT_BACK', 'LEFT_BACK', 'DEFENSIVE_MIDFIELDER', 'MIDFIELDER', 'STRIKER');

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "position",
ADD COLUMN     "position" "Position" NOT NULL;
