-- CreateTable
CREATE TABLE "PractitionerAvailabilityWindow" (
    "id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "window_start_min" INTEGER NOT NULL,
    "window_end_min" INTEGER NOT NULL,
    "slot_duration_min" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "PractitionerAvailabilityWindow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PractitionerAvailabilityWindow_practitioner_id_location_id_idx" ON "PractitionerAvailabilityWindow"("practitioner_id", "location_id");

-- AddForeignKey
ALTER TABLE "PractitionerAvailabilityWindow" ADD CONSTRAINT "PractitionerAvailabilityWindow_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerAvailabilityWindow" ADD CONSTRAINT "PractitionerAvailabilityWindow_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Slot_practitioner_location_start_end_key" ON "Slot"("practitioner_id", "location_id", "start_at", "end_at");
