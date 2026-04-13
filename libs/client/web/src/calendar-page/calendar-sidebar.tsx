import { addHours } from "date-fns";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DatesStoreProvider,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TimeInputsStoreProvider,
  useDatesStoreActions,
  useDatesStoreSelectedDate,
  useTimeInputsStoreActions,
} from "@train-on/client-ui";
import {
  trpc,
  useStudioSelectedLocationId,
  useStudioUser,
  type RouterOutputs,
} from "@train-on/client-utils";

import { BookingTypeSection } from "../events/add-event/booking-type-section";
import {
  RepeatingBooking,
  SingleBooking,
  type RepeatPayload,
  type TimeResult,
} from "../events/add-event/booking-types";
import { ClientEventSection } from "../events/add-event/client-event-section";
import { ClientServiceSection } from "../events/add-event/client-service-section";
import {
  AddEventStoreProvider,
  useAddEventActions,
  useAddEventBookingType,
} from "../events/add-event/store";
import { TrainerSelector } from "../events/add-event/trainer-selector";
import type { FormClient } from "../events/components/types";
import { buildDateFromBlock } from "../events/time-utils";
import { useSidebarActions } from "../right-sidebar/use-sidebar-store";
import { ShiftContent } from "../shift-sidebar/shift-content";
import { eventTypes, useSelectedAddEventType } from "./dates-utils";
import { ReservationBookingContent } from "./reservation-booking-content";
import { useCalendarActions } from "./use-calendar-store";

type E = RouterOutputs["service"]["event"]["getEventById"];

type EventClients = E["clients"];
type EventData = E["event"];

type Props = {
  clickedTimeSlot?: Date | undefined;
  eventClients?: EventClients;
  eventData?: EventData;
  /** When opening from reservations day view, the space (court) that was clicked */
  selectedSpaceId?: string;
};

export const CalendarSidebar = ({
  clickedTimeSlot,
  eventClients,
  eventData,
  selectedSpaceId,
}: Props) => {
  const currentUser = useStudioUser();

  const clients = useMemo(() => {
    const out: FormClient[] = [];
    for (const c of eventClients || []) {
      const alreadyExists = out.some((x) => x.id === c.id);
      if (alreadyExists) continue;

      out.push({
        id: c.id,
        fullName: c.name,
        imageUrl: c.imageUrl,
        serviceSales: c.serviceSales,
      });
    }

    return out.length > 0 ? out : undefined;
  }, [eventClients]);

  const trainer = useMemo(() => {
    if (eventData) {
      return {
        id: eventData.trainer.user.profile?.id || "",
        name: eventData.trainer.user.profile?.fullName || "",
      };
    }
    const isTrainer = currentUser.roles.includes("trainer");
    return isTrainer ? { id: currentUser.id, name: currentUser.fullName } : undefined;
  }, [eventData, currentUser]);

  return (
    <AddEventStoreProvider clients={clients} trainer={trainer} serviceId={eventData?.service?.id}>
      <DatesStoreProvider initialDate={clickedTimeSlot || eventData?.startAt}>
        <TimeInputsStoreProvider
          initialDate={clickedTimeSlot || eventData?.startAt}
          initialStartTime={eventData?.startAt}
          initialEndTime={eventData?.endAt}
        >
          <CalendarSidebarContent
            clickedTimeSlot={clickedTimeSlot}
            eventData={eventData}
            selectedSpaceId={selectedSpaceId}
          />
        </TimeInputsStoreProvider>
      </DatesStoreProvider>
    </AddEventStoreProvider>
  );
};

function CalendarSidebarContent({
  clickedTimeSlot,
  eventData,
  selectedSpaceId,
}: Omit<Props, "eventClients">) {
  const tUtils = trpc.useUtils();
  const locationId = useStudioSelectedLocationId();
  const { closeSidebar } = useSidebarActions();
  const { updateSelectedEvent, resetSelectedEvent } = useCalendarActions();

  const { getValues: getEventValues } = useAddEventActions();
  const bookingType = useAddEventBookingType();
  const { setDate } = useDatesStoreActions();
  const selectedDate = useDatesStoreSelectedDate();
  const { getValues: getTimeInputsValues } = useTimeInputsStoreActions();

  const [selectedEventType, setSelectedEventType] = useSelectedAddEventType();
  const [title, setTitle] = useState("");

  const toastId = useId();
  const createEvent = trpc.service.event.createEvent.useMutation({
    onSuccess: async (res) => {
      toast.success(res.message, { id: toastId });
      await tUtils.service.receptionistEvent.getEventsForTrainerCalendarTimeLine.invalidate();
      closeSidebar();
    },
    onError: (err) => {
      toast.error("Failed", { description: err.message, id: toastId });
      console.error(`Failed to create event`, err);
    },
  });

  const updateEvent = trpc.service.event.updateEventDetails.useMutation({
    onSuccess: async (res) => {
      toast.success(res.title, { description: res.description, id: toastId });
      await tUtils.service.receptionistEvent.getEventsForTrainerCalendarTimeLine.invalidate();
      closeSidebar();
    },
    onError: (err) => {
      toast.error("Failed", { description: err.message, id: toastId });
      console.error(`Failed to update event`, err);
    },
  });

  const createEventAndScheduler = trpc.service.event.createEventAndScheduler.useMutation({
    onSuccess: async () => {
      toast.success("The events were created successfully.");
      await tUtils.service.receptionistEvent.getEventsForTrainerCalendarTimeLine.invalidate();
      closeSidebar();
    },
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("Failed", {
          description: "Conflicting Event",
        });
      }
      if (err.data?.code === "FORBIDDEN") {
        toast.error("Failed", {
          description: "No more than one client can be scheduled to a Private Training",
        });
      }
    },
  });

  useEffect(() => {
    if (clickedTimeSlot || eventData) {
      if (eventData) {
        setTitle(eventData?.title || "");
        eventData?.name && setSelectedEventType(eventData?.name);
      }

      updateSelectedEvent({
        startTime: clickedTimeSlot || eventData?.startAt || new Date(),
        endTime: addHours(new Date(clickedTimeSlot || eventData?.endAt), 1),
        actualPay: "",
        class: "",
        color: "",
        confirmed: false,
        dateKey: "",
        description: "",
        start: clickedTimeSlot || eventData?.startAt,
        end: addHours(new Date(clickedTimeSlot || eventData?.endAt), 1),
        id: "",
        isReceptionist: false,
        people: [],
        profile: { fullName: "", id: "", imageUrl: "" },
        room: "",
        serviceName: "",
        status: "",
        totalPay: "",
        trainerId:
          selectedSpaceId ?? (eventData as { trainerId?: string } | undefined)?.trainerId ?? "",
        trainerName: "",
        title: eventData?.title || "",
      });
    }
  }, [clickedTimeSlot, eventData, selectedSpaceId, updateSelectedEvent]);

  const saveEventSchedulerAsync = async (result: TimeResult, payload: RepeatPayload) => {
    const { trainer, selectedServiceId, selectedAreaId, clients } = getEventValues();

    if (!trainer) {
      toast.error("Please select a trainer");
      return;
    }

    if (!selectedServiceId) {
      toast.error("Please select a service");
      return;
    }

    const clientIds = clients.map((client) => client.id);

    createEventAndScheduler.mutate({
      locationId,
      clientIds: clientIds,
      serviceId: selectedServiceId,
      trainerId: trainer.id,
      areaId: selectedAreaId || undefined,
      title,
      ...payload,
      timeSlots: result.timeSlots,
      eventTimeSlots: result.eventTimeSlots,
    });
  };

  const saveEventFunc = async () => {
    const { trainer, selectedServiceId, selectedAreaId, clients } = getEventValues();
    const { startTime, endTime } = getTimeInputsValues();

    if (!trainer) {
      toast.error("Please select a trainer");
      return;
    }

    if (!selectedServiceId) {
      toast.error("Please select a service");
      return;
    }

    const startAt = buildDateFromBlock(selectedDate, startTime);
    const endAt = buildDateFromBlock(selectedDate, endTime);

    if (!startAt || !endAt) {
      toast.error("Please select a time");
      return;
    }

    const clientIds = clients.map((client) => client.id);

    if (clientIds.length === 0) {
      toast.error("Please select a client");
      return;
    }
    resetSelectedEvent();

    createEvent.mutate({
      locationId,
      clientIds,
      serviceId: selectedServiceId,
      trainerId: trainer.id,
      areaId: selectedAreaId || undefined,
      title,
      name: selectedEventType,
      startAt,
      endAt,
    });
  };

  const updateEventFunc = async () => {
    const { trainer, selectedServiceId, selectedAreaId, clients } = getEventValues();
    const { startTime, endTime } = getTimeInputsValues();
    const eventId = eventData?.id;
    if (
      !eventId ||
      !trainer ||
      !selectedServiceId ||
      !startTime ||
      !endTime ||
      clients.length === 0
    ) {
      toast.error("Missing required fields");
      return;
    }

    const startAt = buildDateFromBlock(selectedDate, startTime) || "";
    const endAt = buildDateFromBlock(selectedDate, endTime) || "";

    updateEvent.mutate({
      eventId,
      locationId,
      clientIds: clients.map((c) => c.id),
      serviceId: selectedServiceId,
      trainerId: trainer.id,
      // areaId: selectedAreaId || undefined,
      name: selectedEventType,
      title,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
    });
  };

  return (
    <div>
      <Tabs
        onValueChange={(val) =>
          setSelectedEventType(val as "reservation" | "shift" | "event" | "service")
        }
        value={
          eventData?.name
            ? eventData.name
            : eventData && !eventData.name
              ? "service"
              : (selectedEventType ?? "")
        }
        defaultValue="service"
        className="pb-6"
      >
        <TabsList variant="chip" size="sm">
          {eventTypes.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              disabled={!!eventData}
              className="ml-2 text-sm capitalize"
            >
              {item
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (s) => s.toUpperCase())
                .replace(/_/g, " ")
                .toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {selectedEventType === "reservation" && <ReservationBookingContent />}

      {selectedEventType === "shift" && (
        <>
          <TrainerSelector label="Assign To" />

          <ShiftContent />
        </>
      )}

      {(selectedEventType === "event" || selectedEventType === "service") && (
        <>
          {selectedEventType === "event" && (
            <>
              <div className="mb-1.5">
                <Label>Title</Label>
              </div>
              <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
            </>
          )}

          {selectedEventType === "event" && <ClientEventSection title="People" />}

          {selectedEventType === "service" && <ClientServiceSection title="People" />}

          <div className="pt-11" />

          <BookingTypeSection />

          {bookingType === "single" ? (
            <SingleBooking
              isLoading={createEvent.isPending || updateEvent.isPending}
              onSubmit={eventData?.id ? updateEventFunc : saveEventFunc}
            />
          ) : (
            <RepeatingBooking
              isLoading={createEventAndScheduler.isPending || updateEvent.isPending}
              onSubmit={saveEventSchedulerAsync}
            />
          )}
        </>
      )}
    </div>
  );
}
