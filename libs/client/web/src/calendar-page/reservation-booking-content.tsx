import { format, setHours, setMinutes } from "date-fns";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";

import { TodayIcon } from "@train-on/client-icons";
import {
  Button,
  Calendar,
  Label,
  MonthSelector,
  SimpleSelect,
  Switch,
  Textarea,
  TimeInputs,
  useDatesStoreActions,
  useDatesStoreSelectedDate,
  useTimeInputsStoreDiff,
  useTimeInputsStoreEndTime,
  useTimeInputsStoreStartTime,
} from "@train-on/client-ui";
import { trpc, useStudioSelectedLocationId } from "@train-on/client-utils";

import { ClientRenderer } from "../events/add-event/client-service-section";
import {
  useAddEventActions,
  useAddEventClients,
  useAddEventSelectedServiceId,
} from "../events/add-event/store";
import { SearchClient } from "../events/components/search-client";
import { useSidebarActions } from "../right-sidebar/use-sidebar-store";
import { useCalendarActions } from "./use-calendar-store";

const REMINDER_OPTIONS = [
  { value: "none", label: "Do not notify" },
  { value: "email", label: "Notify via email" },
  { value: "whatsapp", label: "Notify via whatsapp" },
  { value: "sms", label: "Notify via SMS" },
];

export function ReservationBookingContent() {
  const { closeSidebar } = useSidebarActions();
  const { resetSelectedEvent } = useCalendarActions();
  const { setDate } = useDatesStoreActions();
  const selectedDate = useDatesStoreSelectedDate();
  const startTime = useTimeInputsStoreStartTime();
  const endTime = useTimeInputsStoreEndTime();
  const diff = useTimeInputsStoreDiff();
  const { addClient } = useAddEventActions();
  const clients = useAddEventClients();
  const locationId = useStudioSelectedLocationId();
  const selectedServiceId = useAddEventSelectedServiceId();
  const selectedLocationIds = useMemo(() => [locationId], [locationId]);
  const servicesQuery = trpc.service.getAll.useQuery({ locationIds: selectedLocationIds });
  const selectedService = useMemo(
    () => servicesQuery.data?.find((s) => s.id === selectedServiceId) || null,
    [servicesQuery.data, selectedServiceId],
  );

  // Fetch courts from API
  const courtsQuery = trpc.courtArea.list.useQuery({
    locationIds: selectedLocationIds,
    activeOnly: true,
  });

  const utils = trpc.useUtils();

  const peopleInputId = useId();
  const [allDay, setAllDay] = useState(false);
  const [activityId, setActivityId] = useState("");
  const [courtId, setCourtId] = useState("");
  const [reminder, setReminder] = useState(REMINDER_OPTIONS[0].value);
  const [notes, setNotes] = useState("");

  // Build court options from API data
  const courtOptions = useMemo(() => {
    return (courtsQuery.data ?? []).map((court) => ({
      value: court.id,
      label: `${court.name} (${court.courtType === "INDOOR" ? "Indoor" : "Outdoor"})`,
    }));
  }, [courtsQuery.data]);

  // Build activity options from selected court's activity types
  const activityOptions = useMemo(() => {
    const selectedCourt = courtsQuery.data?.find((c) => c.id === courtId);
    if (!selectedCourt) return [];
    return selectedCourt.activityTypes.split(",").map((activity) => {
      const trimmed = activity.trim();
      return { value: trimmed.toLowerCase(), label: trimmed };
    });
  }, [courtsQuery.data, courtId]);

  const isValidTime = !allDay && startTime !== "" && endTime !== "" && Number.parseInt(diff) > 0;

  // Create reservation mutation
  const createReservationMutation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      utils.reservation.list.invalidate();
      resetSelectedEvent();
      toast.success("Reservation created.");
      closeSidebar();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create reservation.");
    },
  });

  const handleSave = () => {
    if (!courtId) {
      toast.error("Please select a court.");
      return;
    }
    if (!activityId) {
      toast.error("Please select an activity.");
      return;
    }
    if (clients.length === 0) {
      toast.error("Please add at least one client.");
      return;
    }
    if (!allDay && !isValidTime) {
      toast.error("Please select a valid time.");
      return;
    }

    // Parse times and create Date objects
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startDateTime = setMinutes(setHours(selectedDate, startHour), startMin);
    const endDateTime = setMinutes(setHours(selectedDate, endHour), endMin);

    // Get the activity label for the selected activity
    const selectedActivity = activityOptions.find((a) => a.value === activityId);

    createReservationMutation.mutate({
      courtAreaId: courtId,
      activityType: selectedActivity?.label ?? activityId,
      startTime: startDateTime,
      endTime: endDateTime,
      clientIds: clients.map((c) => c.id),
      primaryClientId: clients[0].id,
      notes: notes || undefined,
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Label className="text-[14px] text-white/50">Court</Label>
        <SimpleSelect
          value={courtId}
          onValueChange={(value) => {
            setCourtId(value);
            setActivityId(""); // Reset activity when court changes
          }}
          options={courtOptions}
          placeholder={courtsQuery.isPending ? "Loading courts..." : "Select Court"}
          disabled={courtsQuery.isPending}
        />
      </div>

      <div className="mt-6 flex w-full flex-col gap-2">
        <Label className="text-[14px] text-white/50">Reservation Activity</Label>
        <SimpleSelect
          value={activityId}
          onValueChange={setActivityId}
          options={activityOptions}
          placeholder={courtId ? "Select Activity" : "Select a court first"}
          disabled={!courtId || activityOptions.length === 0}
        />
      </div>

      <div className="mt-6 flex w-full flex-col gap-2">
        <Label className="text-[14px] text-white/50" htmlFor={peopleInputId}>
          People
        </Label>
        <SearchClient canSearch onSelect={addClient} inputId={peopleInputId} />
      </div>

      {clients.length > 0 ? (
        <div className="mt-10 flex flex-wrap gap-4">
          {clients.map((c) => (
            <ClientRenderer key={c.id} client={c} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[14px] leading-[16px] text-brand-white/50">No clients selected</p>
      )}
      {selectedService && !selectedService.isManyClientsAllowed && clients.length > 1 && (
        <p className="mt-2 text-[14px] leading-[16px] text-highlight-red-2">
          Only one client is allowed for this service ({selectedService.name}).
        </p>
      )}

      <div className="mt-6 flex w-full items-center justify-between gap-2 font-medium capitalize">
        <div className="flex flex-row items-center gap-2">
          <span className="hover:cursor-pointer">
            <TodayIcon width={20} />
          </span>
          {format(selectedDate, "EEEE, MMM d")}
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-white/50">All day</span>
          <Switch checked={allDay} onCheckedChange={setAllDay} />
        </div>
      </div>

      <div className="mt-5 w-full border-t-2 border-primary bg-white/5 pb-3">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mt-5 flex w-full flex-col justify-center">
            <div className="flex w-full justify-center">
              <MonthSelector bottomLine={false} />
            </div>
            <Calendar view="month" date={selectedDate} setDate={setDate} />
          </div>
        </div>
      </div>

      {!allDay && (
        <>
          <div className="pt-5" />
          <TimeInputs label="Time" />
        </>
      )}

      <div className="mt-6 flex w-full flex-col gap-2">
        <Label className="text-[14px] text-white/50">Reminder</Label>
        <SimpleSelect
          value={reminder}
          onValueChange={setReminder}
          options={REMINDER_OPTIONS}
          placeholder="Do not notify"
        />
      </div>

      <div className="mt-6 flex w-full flex-col gap-2">
        <Label className="text-[14px] text-white/50">Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type here..."
          className="min-h-[80px] resize-none"
        />
      </div>

      <div className="mt-10 grid w-full grid-cols-2 justify-around gap-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            closeSidebar();
            resetSelectedEvent();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            createReservationMutation.isPending ||
            !activityId ||
            !courtId ||
            clients.length === 0 ||
            (!allDay && (startTime === "" || endTime === "" || Number.parseInt(diff) <= 0))
          }
        >
          {createReservationMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </>
  );
}
