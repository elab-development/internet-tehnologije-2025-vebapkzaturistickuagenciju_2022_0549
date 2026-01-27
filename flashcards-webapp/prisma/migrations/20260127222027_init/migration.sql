/*
  Warnings:

  - You are about to drop the column `brojNocenja` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `cijena` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `datumPolaska` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `datumPovratka` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `destinacija` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `opis` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `slikaUrl` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `naziv` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `datumPocetka` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `datumZavrsetka` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `tip` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `vrijednost` on the `Discount` table. All the data in the column will be lost.
  - The `status` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `ime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lozinka` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `prezime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `uloga` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Arrangement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `Arrangement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Arrangement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfNights` to the `Arrangement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Arrangement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Arrangement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AGENT', 'CLIENT');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- DropIndex
DROP INDEX "Category_naziv_key";

-- AlterTable
ALTER TABLE "Arrangement" DROP COLUMN "brojNocenja",
DROP COLUMN "cijena",
DROP COLUMN "datumPolaska",
DROP COLUMN "datumPovratka",
DROP COLUMN "destinacija",
DROP COLUMN "opis",
DROP COLUMN "slikaUrl",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "numberOfNights" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "naziv",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "datumPocetka",
DROP COLUMN "datumZavrsetka",
DROP COLUMN "tip",
DROP COLUMN "vrijednost",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "status",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ime",
DROP COLUMN "lozinka",
DROP COLUMN "prezime",
DROP COLUMN "uloga",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';

-- DropEnum
DROP TYPE "StatusRezervacije";

-- DropEnum
DROP TYPE "Uloga";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
