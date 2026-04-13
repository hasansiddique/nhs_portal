"use client";

import {
  addHours,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Button, toast } from "@train-on/client-ui";
import { cn, useStudioSelectedLocationIds } from "@train-on/client-utils";

import { EventDetailsPage } from "../../events/view-event/event-details-page";
import { useSidebarActions } from "../../right-sidebar/use-sidebar-store";
import { useCalendarActions, useCalendarState } from "../use-calendar-store";
import { EndHour, StartHour } from "./constants";
import {
  DraggableEvent,
  DroppableCell,
  isMultiDayEvent,
  useCurrentTimeIndicator,
  WeekCellsHeight,
  type CalendarEvent,
} from "./index";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventCreate: (startTime: Date) => void;
}

interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
}

type SelectionSource = "grid" | "event" | null;

export function WeekView({ currentDate, events, onEventCreate }: WeekViewProps) {
  const locationIds = useStudioSelectedLocationIds();
  const { openSidebar } = useSidebarActions();
  const { updateSelectedEvent } = useCalendarActions();
  const { currentSelectedEvent } = useCalendarState();

  const [overflowEvents, setOverflowEvents] = useState<PositionedEvent[] | null>(null);
  const [selectionSource, setSelectionSource] = useState<SelectionSource>(null);

  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  // Process events for each day to calculate positions
  const processedDayEvents = useMemo(() => {
    return days.map((day) => {
      const dayEvents = events.filter((event) => {
        if (isMultiDayEvent(event)) return false;
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return (
          isSameDay(day, eventStart) ||
          isSameDay(day, eventEnd) ||
          (eventStart < day && eventEnd > day)
        );
      });
      return computePositionsForDay(dayEvents, day, StartHour, WeekCellsHeight);
    });
  }, [days, events]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectionSource("event");
    if (locationIds.length === 1) {
      updateSelectedEvent(event);
      openSidebar({ label: "Event Details", content: <EventDetailsPage eventId={event.id} /> });
    } else {
      toast({
        description: "To add an event, please select a location at the top.",
        variant: "destructive",
      });
    }
  };
  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(currentDate, "week");

  return (
    <div data-slot="week-view" className="relative top-[72px] flex h-full flex-col">
      <div className="sticky top-[146px] z-30 border-b border-white/7 bg-background pl-[63px]">
        <div className="grid h-[84px] grid-cols-7 border-l border-white/7 bg-background uppercase">
          {days.map((day, index) => {
            const originalDate = new Date(day);
            const formattedDate = format(originalDate, "EEE, dd");

            return (
              <div
                key={`${originalDate}-${index}`}
                className={`flex flex-col items-center border-r border-white/7 pt-[9px] pb-[7px] last:border-r-0`}
              >
                <p className="mb-[2px] text-[14px] leading-[22px] font-normal text-white/75 capitalize">
                  {formattedDate.substring(0, 3).toUpperCase()}
                </p>

                <div>
                  <p
                    className={cn(
                      "px-[11px] py-[10px] text-center text-[24px] leading-[24px] font-semibold tracking-[1px]",
                      isToday(originalDate) && "h-[44px] w-[52px] rounded-[4px] bg-white/15",
                    )}
                  >
                    {formattedDate.substring(4).toUpperCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="relative grid flex-1 overflow-hidden"
        style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}
      >
        {/* Current time indicator spanning all days */}
        {currentTimeVisible && (
          <div
            className="pointer-events-none absolute right-0 left-[64px] z-20"
            style={{ top: `${currentTimePosition}%` }}
          >
            <div className="relative flex h-0">
              <div className="absolute top-[-1px] right-0 left-0 h-[2px] bg-primary"></div>
              {days.map((day, dayIndex) => (
                <div
                  key={day.toString()}
                  className="relative flex-1 border-r border-white/7 last:border-r-0"
                >
                  {dayIndex === 0 && (
                    <div className="absolute top-[-4px] -left-1 h-2 w-2 rotate-45 bg-primary"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          {hours.map((hour) => (
            <div
              key={hour.toString()}
              className="relative h-[var(--week-cells-height)] border-r border-b border-white/7 last:border-b-0"
            >
              <span className="absolute top-[5px] right-[11px] left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background text-[12px] text-white/75 sm:pe-4 sm:text-xs">
                {format(hour, "h a")}
              </span>
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => (
          <div
            key={day.toString()}
            className="relative grid auto-cols-fr border-r border-white/7 last:border-r-0"
            data-today={isToday(day) || undefined}
          >
            {(() => {
              const eventsByTop: Record<number, PositionedEvent[]> = {};
              (processedDayEvents[dayIndex] ?? []).forEach((ev) => {
                const topKey = Math.round(ev.top);
                if (!eventsByTop[topKey]) eventsByTop[topKey] = [];
                eventsByTop[topKey].push(ev);
              });

              return Object.entries(eventsByTop).map(([top, eventsInRow]) => (
                <WeekEventRow
                  key={top}
                  eventsInRow={eventsInRow}
                  handleEventClick={handleEventClick}
                />
              ));
            })()}

            {hours.map((hour) => {
              const hourValue = getHours(hour);
              const eventStart =
                (currentSelectedEvent as any)?.startTime ??
                (currentSelectedEvent as any)?.start ??
                null;

              const shouldHighlight =
                eventStart &&
                selectionSource === "grid" &&
                isSameDay(eventStart, day) &&
                getHours(eventStart) === hourValue;

              return (
                <div
                  key={hour.toString()}
                  className="relative min-h-[var(--week-cells-height)] border-b border-white/7 last:border-b-0"
                  style={
                    shouldHighlight
                      ? {
                          border: "2px solid var(--primary)",
                          position: "relative",
                          zIndex: 11,
                          backgroundColor: "var(--background)",
                        }
                      : {}
                  }
                >
                  {/* Half-hour dashed line */}
                  <svg
                    className="absolute top-1/2 right-0 left-0 z-0 h-[2px] w-full"
                    style={{ top: "50%" }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                  </svg>
                  {/* Quarter-hour intervals */}
                  {[0, 1, 2, 3].map((quarter, index) => {
                    const quarterHourTime = hourValue + quarter * 0.25;
                    return (
                      <DroppableCell
                        key={`${hour.toString()}-${quarter}`}
                        id={`week-cell-${day.toISOString()}-${quarterHourTime}`}
                        date={day}
                        time={quarterHourTime}
                        className={cn(
                          "absolute h-[calc(var(--week-cells-height)/4)] w-full",
                          quarter === 0 && "top-0",
                          quarter === 1 && "top-[calc(var(--week-cells-height)/4)]",
                          quarter === 2 && "top-[calc(var(--week-cells-height)/4*2)]",
                          quarter === 3 && "top-[calc(var(--week-cells-height)/4*3)]",
                        )}
                        onClick={() => {
                          const startTime = new Date(day);
                          startTime.setHours(hourValue);
                          startTime.setMinutes(quarter * 15);
                          setSelectionSource("grid");
                          onEventCreate(startTime);
                        }}
                      >
                        {index === 0 && shouldHighlight ? (
                          <p className="mt-[8px] ml-[14px]">Add Event</p>
                        ) : (
                          ""
                        )}
                      </DroppableCell>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {overflowEvents && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/50"
          onClick={() => setOverflowEvents(null)}
        >
          <div
            className="max-h-[80vh] max-w-[90vw] min-w-[320px] overflow-auto rounded-lg bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 text-lg font-semibold">All Events</h2>
            <div className="flex flex-col gap-2">
              {overflowEvents.map((ev) => (
                <div
                  key={ev.event.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleEventClick(ev.event, e);
                  }}
                >
                  <DraggableEvent event={ev.event} view="week" showTime />
                </div>
              ))}
            </div>

            <Button
              onClick={() => setOverflowEvents(null)}
              type="button"
              variant="secondary"
              className="mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface WeekEventRowProps {
  eventsInRow: PositionedEvent[];
  handleEventClick: (e: CalendarEvent, ev: React.MouseEvent) => void;
}

const MIN_EVENT_WIDTH = 50;

const WeekEventRow = ({ eventsInRow, handleEventClick }: WeekEventRowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(el.offsetWidth);
    });
    resizeObserver.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => resizeObserver.disconnect();
  }, []);

  const sortedEvents = [...eventsInRow].sort((a, b) => a.left - b.left);

  const maxVisible = Math.max(1, Math.floor(containerWidth / MIN_EVENT_WIDTH));

  const visibleEvents = sortedEvents.slice(0, maxVisible);
  const hiddenEvents = sortedEvents.slice(maxVisible);

  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showMore) return;
    function onDocClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showMore]);

  const dynamicWidth = visibleEvents.length > 0 ? 100 / visibleEvents.length : 100;

  return (
    <div
      ref={containerRef}
      className="absolute"
      style={{
        left: "0%",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        pointerEvents: "auto",
        top: `${eventsInRow[0].top}px`,
        height: `${eventsInRow[0].height}px`,
        width: eventsInRow?.length > maxVisible ? "85%" : "96%",
        zIndex: Math.max(...eventsInRow.map((ev) => ev.zIndex)),
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {visibleEvents.map((ev) => (
        <div
          key={ev.event.id}
          style={{
            minWidth: `${MIN_EVENT_WIDTH}px`,
            flex: `0 0 ${dynamicWidth}%`,
            maxWidth: `${dynamicWidth}%`,
            boxSizing: "border-box",
            position: "relative",
            paddingRight: "2px",
            zIndex: ev.zIndex,
            height: "100%",
          }}
        >
          <DraggableEvent
            onClick={(e) => handleEventClick(ev.event, e)}
            height={ev.height - 4}
            event={ev.event}
            view="week"
            showTime
          />
        </div>
      ))}
      {hiddenEvents.length > 0 && (
        <div style={{ position: "relative", minWidth: MIN_EVENT_WIDTH }}>
          {!showMore ? (
            <button
              className="h-full cursor-pointer items-center bg-background text-xs text-white/50 hover:border hover:border-primary"
              onClick={(e) => {
                setShowMore(true);
                e.stopPropagation();
              }}
              type="button"
            >
              +{hiddenEvents.length}
            </button>
          ) : (
            <div
              ref={moreRef}
              style={{ top: 0, right: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute z-[21] flex flex-row gap-1"
            >
              {hiddenEvents.map((ev) => (
                <div key={ev.event.id} style={{ width: `${MIN_EVENT_WIDTH}px`, cursor: "pointer" }}>
                  <DraggableEvent
                    onClick={(e) => handleEventClick(ev.event, e)}
                    height={ev.height - 4}
                    event={ev.event}
                    view="week"
                    showTime
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
}

function isOverlapping(e1: { start: Date; end: Date }, e2: { start: Date; end: Date }) {
  return e1.start < e2.end && e2.start < e1.end;
}

function computePositionsForDay(
  events: CalendarEvent[],
  day: Date,
  StartHour: number,
  WeekCellsHeight: number,
): PositionedEvent[] {
  type LocalEvent = { event: CalendarEvent; start: Date; end: Date };

  const sorted: LocalEvent[] = events
    .map((event) => ({
      event,
      start: new Date(event.start),
      end: new Date(event.end),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const clusters: LocalEvent[][] = [];
  let currentCluster: LocalEvent[] = [];
  sorted.forEach((e) => {
    if (currentCluster.length === 0) {
      currentCluster.push(e);
    } else if (currentCluster.some((ec) => isOverlapping(ec, e))) {
      currentCluster.push(e);
    } else {
      clusters.push(currentCluster);
      currentCluster = [e];
    }
  });
  if (currentCluster.length) clusters.push(currentCluster);

  const positioned: PositionedEvent[] = [];
  clusters.forEach((cluster) => {
    const lanes: { end: Date }[] = [];
    const colAssignments: number[] = [];
    cluster.forEach((ev, idx) => {
      let col = 0;
      for (; col < lanes.length; col++) {
        if (ev.start >= lanes[col].end) break;
      }
      lanes[col] = { end: ev.end };
      colAssignments[idx] = col;
    });
    const columns = lanes.length;
    cluster.forEach((ev, idx) => {
      const dayStart = startOfDay(day);
      const adjustedStart = isSameDay(day, ev.start) ? ev.start : dayStart;
      const adjustedEnd = isSameDay(day, ev.end) ? ev.end : addHours(dayStart, 24);
      const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
      const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;
      const top = (startHour - StartHour) * WeekCellsHeight;
      const height = (endHour - startHour) * WeekCellsHeight;

      positioned.push({
        event: ev.event,
        top,
        height,
        left: colAssignments[idx] / columns,
        width: 1 / columns,
        zIndex: colAssignments[idx],
      });
    });

    positioned.sort((a, b) => {
      const aStart = new Date(a.event.start).getTime();
      const bStart = new Date(b.event.start).getTime();
      return aStart - bStart;
    });
    positioned.forEach((ev, i) => {
      ev.zIndex = 10 + i;
    });
  });

  return positioned;
}
