-- CreateEnum
CREATE TYPE "Uloga" AS ENUM ('ADMIN', 'AGENT', 'KLIJENT');

-- CreateEnum
CREATE TYPE "StatusRezervacije" AS ENUM ('KREIRANA', 'POTVRDJENA', 'OTKAZANA', 'ZAVRSENA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lozinka" TEXT NOT NULL,
    "uloga" "Uloga" NOT NULL DEFAULT 'KLIJENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrangement" (
    "id" SERIAL NOT NULL,
    "destinacija" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "cijena" DOUBLE PRECISION NOT NULL,
    "datumPolaska" TIMESTAMP(3) NOT NULL,
    "datumPovratka" TIMESTAMP(3) NOT NULL,
    "brojNocenja" INTEGER NOT NULL,
    "slikaUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "status" "StatusRezervacije" NOT NULL DEFAULT 'KREIRANA',
    "userId" INTEGER NOT NULL,
    "arrangementId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "tip" TEXT NOT NULL,
    "vrijednost" DOUBLE PRECISION NOT NULL,
    "datumPocetka" TIMESTAMP(3) NOT NULL,
    "datumZavrsetka" TIMESTAMP(3) NOT NULL,
    "arrangementId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_naziv_key" ON "Category"("naziv");

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
