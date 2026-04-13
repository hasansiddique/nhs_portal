import { create } from "zustand";

import type { CalendarEvent } from "./event-calendar/types";

type CalendarState = {
  currentSelectedEvent?: CalendarEvent | null;
};

interface CalendarStore {
  calendarState: CalendarState;
  actions: {
    updateSelectedEvent: (calendarEvent: CalendarEvent) => void;
    resetSelectedEvent: () => void;
  };
}

const useSidebarStore = create<CalendarStore>((set) => ({
  calendarState: {
    currentSelectedEvent: null,
  },
  actions: {
    updateSelectedEvent: (calendarEvent: CalendarEvent) =>
      set((state) => ({
        calendarState: {
          ...state.calendarState,
          currentSelectedEvent: calendarEvent,
        },
      })),
    resetSelectedEvent: () =>
      set((state) => ({
        calendarState: {
          ...state.calendarState,
          currentSelectedEvent: null,
        },
      })),
  },
}));

export const useCalendarState = (): CalendarState =>
  useSidebarStore((state) => state.calendarState);

export const useCalendarActions = () => useSidebarStore((state) => state.actions);
