import { useMemo } from "react";

import { ErrorBoundary } from "@train-on/client-ui";
import { trpc, useStudioSelectedLocationIds } from "@train-on/client-utils";

import { useClientSearchSelectedClient } from "../header/use-client-search-input-store";
import { useDatesHandler } from "./dates-utils";
import { EventCalendar, getEventColor, type CalendarEvent } from "./event-calendar";

type EventsByDate = Record<string, CalendarEvent[]>;

// Activity type to color mapping for reservations
const ACTIVITY_COLORS: Record<string, string> = {
  pickleball: "#5A5FDF",
  tennis: "#40D861",
  golf: "#FF9500",
  tanning: "#FF6B6B",
};

function getReservationColor(activityType: string): string {
  const normalized = activityType.toLowerCase().trim();
  return ACTIVITY_COLORS[normalized] ?? "#19C4CF";
}

export const NewCalendarPage = () => {
  const locationIds = useStudioSelectedLocationIds();

  const dh = useDatesHandler();

  const client = useClientSearchSelectedClient();

  const isReservationsView = dh.selectedService === "reservations";

  const calendarEventTrainer =
    trpc.service.receptionistEvent.getEventsForTrainerCalendarTimeLine.useQuery(
      {
        eventType: dh.selectedService,
        startDate: dh.startDate,
        endDate: dh.endDate,
        myCalendar: dh.myCalendar === "my calendar",
        locationIds,
        ...(client && dh.selectedService !== "shifts" ? { searchedId: client.id } : {}),
      },
      { enabled: !isReservationsView },
    );

  // Fetch reservations when in reservations view
  const reservationsQuery = trpc.reservation.list.useQuery(
    {
      locationIds,
      startDate: dh.startDate,
      endDate: dh.endDate,
      ...(client ? { clientId: client.id } : {}),
    },
    { enabled: isReservationsView },
  );

  function flattenEvents(eventsByDate: EventsByDate): CalendarEvent[] {
    const result: CalendarEvent[] = [];

    for (const [dateKey, events] of Object.entries(eventsByDate)) {
      for (const event of events) {
        const isShift = event?.serviceName === "shift";
        const isMeeting = event?.serviceName === "meeting";

        const eventColor = getEventColor({
          isFree: event.serviceIsFree,
          isManyClientsAllowed: event.serviceIsManyClientsAllowed,
          isShift,
          isMeeting,
          isUnknown: !event.serviceName,
        });

        result.push({
          ...event,
          description: `${event.serviceName} ${event.isReceptionist}`,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          title: event.serviceName,
          color: eventColor,
          dateKey,
        });
      }
    }

    return result;
  }

  // Transform reservations to CalendarEvent format
  function transformReservations(
    reservations: NonNullable<typeof reservationsQuery.data>,
  ): CalendarEvent[] {
    return reservations.map((r) => {
      const start = new Date(r.startTime);
      const end = new Date(r.endTime);
      const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);
      const primaryClient = r.clients.find((c) => c.isPrimary) ?? r.clients[0];

      return {
        id: r.id,
        room: "",
        title: r.activityType,
        description: `${r.activityType}, ${durationMins} Mins`,
        actualPay: "",
        class: "",
        confirmed: r.status === "CONFIRMED",
        endTime: end.toISOString(),
        startTime: start.toISOString(),
        isReceptionist: false,
        people: r.clients.map((c) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          fullName: c.name,
          imageUrl: null,
        })),
        profile: {
          id: primaryClient?.id ?? "",
          fullName: primaryClient?.name ?? "",
          imageUrl: null,
        },
        serviceName: r.activityType,
        start,
        end,
        status: r.status,
        totalPay: "",
        trainerId: r.courtAreaId,
        trainerName: r.courtName,
        dateKey: start.toISOString().slice(0, 10),
        color: getReservationColor(r.activityType),
      };
    });
  }

  const flattenedEvents = useMemo(() => {
    if (isReservationsView) {
      if (reservationsQuery.isSuccess && reservationsQuery.data) {
        return transformReservations(reservationsQuery.data);
      }
      return [];
    }
    if (calendarEventTrainer.isSuccess && calendarEventTrainer.data?.events) {
      return flattenEvents(calendarEventTrainer.data.events);
    }
    return null;
  }, [
    isReservationsView,
    reservationsQuery.isSuccess,
    reservationsQuery.data,
    calendarEventTrainer.isSuccess,
    calendarEventTrainer.data?.events,
  ]);

  const isLoading =
    (isReservationsView && reservationsQuery.isPending) ||
    (!isReservationsView && calendarEventTrainer.isPending);

  return (
    <ErrorBoundary>
      <EventCalendar isLoading={isLoading} events={flattenedEvents || []} />
    </ErrorBoundary>
  );
};
