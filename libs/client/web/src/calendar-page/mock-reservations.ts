import { addDays, addHours, differenceInDays, startOfDay } from "date-fns";

import type { CalendarEvent } from "./event-calendar";

export interface ReservationSpace {
  id: string;
  name: string;
  type: string; // e.g. "Indoor"
}

/** Mock spaces (courts) for reservations calendar - no API yet */
export const MOCK_SPACES: ReservationSpace[] = [
  { id: "court-1", name: "Court 1", type: "Indoor" },
  { id: "court-2", name: "Court 2", type: "Indoor" },
  { id: "court-3", name: "Court 3", type: "Indoor" },
];

/** Generate mock reservation events matching Figma (Pickleball, Tennis, 60 Mins, etc.) */
export function getMockReservationsForRange(startDate: Date, endDate: Date): CalendarEvent[] {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  const days = Math.max(1, differenceInDays(end, start) + 1);
  const allEvents: CalendarEvent[] = [];
  const violet = "#5A5FDF";
  const green = "#40D861";

  for (let d = 0; d < days; d++) {
    const base = addDays(start, d);

    [0, 1].forEach((spaceIndex) => {
      allEvents.push(
        toCalendarEvent({
          id: `res-1-${d}-${spaceIndex}`,
          spaceId: MOCK_SPACES[spaceIndex].id,
          title: "Pickleball",
          start: addHours(base, 7),
          end: addHours(base, 8),
          color: violet,
          durationMins: 60,
        }),
      );
    });

    allEvents.push(
      toCalendarEvent({
        id: `res-2-${d}`,
        spaceId: MOCK_SPACES[2].id,
        title: "Tennis",
        start: addHours(base, 8),
        end: addHours(base, 9),
        color: green,
        durationMins: 60,
      }),
    );

    allEvents.push(
      toCalendarEvent({
        id: `res-3-${d}`,
        spaceId: MOCK_SPACES[0].id,
        title: "Tennis",
        start: addHours(base, 10),
        end: addHours(base, 11),
        color: green,
        durationMins: 60,
      }),
    );

    allEvents.push(
      toCalendarEvent({
        id: `res-4-${d}`,
        spaceId: MOCK_SPACES[1].id,
        title: "Pickleball",
        start: addHours(base, 10),
        end: addHours(base, 11),
        color: violet,
        durationMins: 60,
      }),
    );

    [0, 1].forEach((spaceIndex) => {
      allEvents.push(
        toCalendarEvent({
          id: `res-5-${d}-${spaceIndex}`,
          spaceId: MOCK_SPACES[spaceIndex].id,
          title: "Pickleball",
          start: addHours(base, 11),
          end: addHours(base, 12),
          color: violet,
          durationMins: 60,
        }),
      );
    });
  }

  return allEvents.filter((e) => {
    const eventStart = new Date(e.start);
    return eventStart >= startDate && eventStart <= endDate;
  });
}

function toCalendarEvent({
  id,
  spaceId,
  title,
  start,
  end,
  color,
  durationMins,
}: {
  id: string;
  spaceId: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  durationMins: number;
}): CalendarEvent {
  return {
    id,
    room: "",
    title,
    description: `${title}, ${durationMins} Mins`,
    actualPay: "",
    class: "",
    confirmed: true,
    endTime: end.toISOString(),
    startTime: start.toISOString(),
    isReceptionist: false,
    people: [],
    profile: { id: "", fullName: "", imageUrl: null },
    serviceName: title,
    start,
    end,
    status: "",
    totalPay: "",
    trainerId: spaceId,
    trainerName: "",
    dateKey: start.toISOString().slice(0, 10),
    color,
  };
}
