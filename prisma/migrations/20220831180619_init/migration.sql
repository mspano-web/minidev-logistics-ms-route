-- CreateEnum
CREATE TYPE "DependencyType" AS ENUM ('ORIGIN', 'DESTINY', 'OTHER');

-- CreateEnum
CREATE TYPE "CashDepositType" AS ENUM ('PENDING', 'DEPOSITED');

-- CreateTable
CREATE TABLE "zones" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routesheader" (
    "id" SERIAL NOT NULL,
    "created_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transport_id" INTEGER NOT NULL,
    "origin_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "zone_id" INTEGER NOT NULL,
    "time_started" TIMESTAMP(3),
    "time_end" TIMESTAMP(3),
    "cashDeposited" "CashDepositType" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "routesheader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routesdetails" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "routeId" INTEGER NOT NULL,

    CONSTRAINT "routesdetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companydependency" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "dependencyType" "DependencyType" NOT NULL DEFAULT 'OTHER',
    "zone_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "companydependency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "routesdetails" ADD CONSTRAINT "routesdetails_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routesheader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
