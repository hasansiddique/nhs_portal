"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isFirstDayOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger, toast } from "@train-on/client-ui";
import { useStudioSelectedLocationIds } from "@train-on/client-utils";

import { EventDetailsPage } from "../../events/view-event/event-details-page";
import { useSidebarActions } from "../../right-sidebar/use-sidebar-store";
import { useDatesHandler } from "../dates-utils";
import { useCalendarState } from "../use-calendar-store";
import { DefaultStartHour } from "./constants";
import {
  DraggableEvent,
  DroppableCell,
  EventGap,
  EventHeight,
  EventItem,
  getAllEventsForDay,
  getEventsForDay,
  getSpanningEventsForDay,
  sortEvents,
  useEventVisibility,
  type CalendarEvent,
} from "./index";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventCreate: (startTime: Date) => void;
}

export function MonthView({ currentDate, events, onEventCreate }: MonthViewProps) {
  const dh = useDatesHandler();

  const locationIds = useStudioSelectedLocationIds();
  const { openSidebar } = useSidebarActions();
  const { currentSelectedEvent } = useCalendarState();

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
      return format(date, "EEE");
    });
  }, []);

  const weeks = useMemo(() => {
    const result = [];
    let week = [];

    for (let i = 0; i < days.length; i++) {
      week.push(days[i]);
      if (week.length === 7 || i === days.length - 1) {
        result.push(week);
        week = [];
      }
    }

    return result;
  }, [days]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (locationIds.length === 1) {
      openSidebar({ label: "Event Details", content: <EventDetailsPage eventId={event.id} /> });
    } else {
      toast({
        description: "To view an event, please select a location at the top.",
        variant: "destructive",
      });
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EventHeight,
    eventGap: EventGap,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div data-slot="month-view" className="relative top-[72px] flex h-full flex-col">
      <div className="grid grid-cols-7 border-b border-white/7 uppercase">
        {weekdays.map((day) => (
          <div
            key={day}
            className="flex h-[40px] items-center justify-center border-l border-white/7 text-center text-[14px] text-white/75 last:border-r"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid flex-1 auto-rows-fr">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="grid grid-cols-7">
            {week.map((day, dayIndex) => {
              if (!day) return null; // Skip if day is undefined

              const dayEvents = getEventsForDay(events, day);
              const spanningEvents = getSpanningEventsForDay(events, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const cellId = `month-cell-${day.toISOString()}`;
              const allDayEvents = [...spanningEvents, ...dayEvents];
              const allEvents = getAllEventsForDay(events, day);

              const isReferenceCell = weekIndex === 0 && dayIndex === 0;
              const visibleCount = isMounted
                ? getVisibleEventCount(allDayEvents.length)
                : undefined;

              const sortedAllDay = sortEvents(allDayEvents);

              const visibleItems =
                visibleCount !== undefined ? sortedAllDay.slice(0, visibleCount) : [];

              const hiddenItems =
                visibleCount !== undefined ? sortedAllDay.slice(visibleCount) : [];

              const hasMore = hiddenItems.length > 0;
              const remainingCount = hiddenItems.length;

              // const hasMore = visibleCount !== undefined && allDayEvents.length > visibleCount;
              // const remainingCount = hasMore ? allDayEvents.length - visibleCount : 0;

              const shouldHighlight =
                currentSelectedEvent &&
                isSameDay(new Date(currentSelectedEvent.start), day) &&
                isSameDay(new Date(currentSelectedEvent.end), day);

              return (
                <div
                  key={day.toString()}
                  className="group h-[136px] border-b border-l border-white/7 last:border-r-0 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70"
                  data-today={isToday(day) || undefined}
                  data-outside-cell={!isCurrentMonth || undefined}
                >
                  <DroppableCell
                    id={cellId}
                    date={day}
                    onClick={() => {
                      const startTime = new Date(day);
                      startTime.setHours(DefaultStartHour, 0, 0);
                      onEventCreate(startTime);
                    }}
                  >
                    <div
                      className={`inline-flex size-6 h-[24px] items-center rounded-[1px] p-1 text-[12px] leading-[20px] group-data-today:bg-white/15 group-data-today:text-white ${isFirstDayOfMonth(day) ? "w-fit text-left whitespace-nowrap text-white" : "w-[24px] justify-center text-white/50"}`}
                    >
                      <span
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          dh.setDateOn(new Date(day));
                          dh.setSelectedRange("day");
                        }}
                      >
                        {isFirstDayOfMonth(day) ? format(day, "MMMM d") : format(day, "d")}
                      </span>
                    </div>
                    <div
                      ref={isReferenceCell ? contentRef : null}
                      className="min-h-0 flex-1 overflow-hidden"
                    >
                      <div className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]">
                        {visibleItems.map((event, index) => {
                          const eventStart = new Date(event.start);
                          const eventEnd = new Date(event.end);
                          const isFirstDay = isSameDay(day, eventStart);
                          const isLastDay = isSameDay(day, eventEnd);

                          const isHidden = isMounted && visibleCount && index >= visibleCount;

                          if (!visibleCount) return null;

                          if (!isFirstDay) {
                            return null; /*(
                            <div
                              key={`spanning-${event.id}-${day.toISOString().slice(0, 10)}`}
                              className="aria-hidden:hidden"
                              aria-hidden={isHidden ? "true" : undefined}
                            >
                              <EventItem
                                onClick={(e) => handleEventClick(event, e)}
                                event={event}
                                view="month"
                                isFirstDay={isFirstDay}
                                isLastDay={isLastDay}
                              >
                                <div className="invisible" aria-hidden={true}>
                                  {event.title}
                                </div>
                              </EventItem>
                            </div>
                          );*/
                          }

                          return (
                            <div
                              key={event.id}
                              className="aria-hidden:hidden"
                              aria-hidden={isHidden ? "true" : undefined}
                            >
                              <DraggableEvent
                                view="month"
                                event={event}
                                isLastDay={isLastDay}
                                isFirstDay={isFirstDay}
                                onClick={(e) => handleEventClick(event, e)}
                              />
                            </div>
                          );
                        })}

                        {shouldHighlight && (
                          <div className="mt-1">
                            <EventItem
                              event={currentSelectedEvent}
                              view="month"
                              isFirstDay={true}
                              isLastDay={true}
                              onClick={(e) => handleEventClick(currentSelectedEvent, e)}
                            >
                              <div className="mx-[8px] flex h-[16px] cursor-pointer flex-row items-center">
                                <div className={`h-[6px] w-[6px] rounded-full bg-primary`} />
                                <p className="ml-[6px] text-[12px] leading-[16px] text-white/50">
                                  {format(new Date(currentSelectedEvent.startTime), "hh:mm a")}
                                </p>
                                <p className="mx-[6px] text-white/50">-</p>
                                <p className="text-[12px] leading-[16px] capitalize">
                                  {currentSelectedEvent.title}
                                </p>
                              </div>
                            </EventItem>
                          </div>
                        )}

                        {hasMore && (
                          <Popover modal>
                            <PopoverTrigger asChild>
                              <button
                                className="mt-[var(--event-gap)] flex h-[var(--event-height)] w-full items-center overflow-hidden px-1 text-left text-[10px] text-white/50 backdrop-blur-md transition outline-none select-none hover:bg-muted/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-2 sm:text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>
                                  + {remainingCount} <span className="max-sm:sr-only">more</span>
                                </span>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="center"
                              className="max-w-52 p-3"
                              style={
                                {
                                  "--event-height": `${EventHeight}px`,
                                } as React.CSSProperties
                              }
                            >
                              <div className="space-y-2">
                                <div className="text-sm font-medium">{format(day, "EEE d")}</div>
                                <div className="space-y-1">
                                  {hiddenItems.map((event) => {
                                    const eventStart = new Date(event.start);
                                    const eventEnd = new Date(event.end);
                                    const isFirstDay = isSameDay(day, eventStart);
                                    const isLastDay = isSameDay(day, eventEnd);

                                    return (
                                      <EventItem
                                        key={event.id}
                                        onClick={(e) => handleEventClick(event, e)}
                                        event={event}
                                        view="month"
                                        isFirstDay={isFirstDay}
                                        isLastDay={isLastDay}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </DroppableCell>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
