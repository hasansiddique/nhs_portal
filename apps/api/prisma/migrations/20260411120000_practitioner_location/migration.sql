-- CreateTable
CREATE TABLE "PractitionerLocation" (
    "id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerLocation_practitioner_id_location_id_key" ON "PractitionerLocation"("practitioner_id", "location_id");

-- CreateIndex
CREATE INDEX "PractitionerLocation_location_id_idx" ON "PractitionerLocation"("location_id");

-- AddForeignKey
ALTER TABLE "PractitionerLocation" ADD CONSTRAINT "PractitionerLocation_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerLocation" ADD CONSTRAINT "PractitionerLocation_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
