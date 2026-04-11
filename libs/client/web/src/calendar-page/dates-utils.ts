import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";

import { useCalendarRangeDates } from "../components/calendar/use-calendar-range-dates";

export { ranges, type RangeType } from "../components/calendar/calendar-controls";

export const services = ["event", "shifts", "all", "reservations"] as const;
export type ServiceType = (typeof services)[number];

/** For reservations view: "all" or space id */
export const RESERVATIONS_SPACE_ALL = "all" as const;
export type SelectedSpaceId = string;

export const eventTypes = ["reservation", "service", "shift", "event"] as const;
export type EventType = (typeof eventTypes)[number];

export function useSelectedAddEventType() {
  return useQueryState(
    "add-event-type",
    parseAsStringLiteral(eventTypes).withDefault(eventTypes[0]),
  );
}

function useMyCalendarEvents() {
  return useQueryState(
    "my-events-only",
    parseAsStringLiteral(["my calendar", "team", "trainer"]).withDefault("team"),
  );
}

function useSelectedService() {
  return useQueryState("service", parseAsStringLiteral(services).withDefault(services[0]));
}

function useSelectedSpace() {
  return useQueryState("space", parseAsString.withDefault(RESERVATIONS_SPACE_ALL));
}

function useCalendarFilters() {
  const [myCalendar, setMyCalendar] = useMyCalendarEvents();
  const [selectedService, setSelectedService] = useSelectedService();
  const [selectedSpaceId, setSelectedSpaceId] = useSelectedSpace();

  return {
    myCalendar,
    setMyCalendar,
    selectedService,
    setSelectedService,
    selectedSpaceId,
    setSelectedSpaceId,
  };
}

export function useDatesHandler() {
  const dateHandlers = useCalendarRangeDates();
  const filters = useCalendarFilters();

  return {
    ...dateHandlers,
    ...filters,
  };
}
