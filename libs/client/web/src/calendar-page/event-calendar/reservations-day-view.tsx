import {
  addHours,
  areIntervalsOverlapping,
  eachHourOfInterval,
  format,
  getHours,
  getMinutes,
  startOfDay,
} from "date-fns";
import type React from "react";
import { useMemo, useState } from "react";

import { DotRevolve, toast } from "@train-on/client-ui";
import { cn, trpc, useStudioSelectedLocationIds } from "@train-on/client-utils";

import { useSidebarActions } from "../../right-sidebar/use-sidebar-store";
import { RESERVATIONS_SPACE_ALL, useDatesHandler } from "../dates-utils";
import { useCalendarActions, useCalendarState } from "../use-calendar-store";
import { EndHour, StartHour } from "./constants";
import {
  DraggableEvent,
  DroppableCell,
  useCurrentTimeIndicator,
  WeekCellsHeight,
  type CalendarEvent,
} from "./index";

interface ReservationSpace {
  id: string;
  name: string;
  type: string;
}

function ReservationDetailsContent({
  event,
  spaces,
}: {
  event: CalendarEvent;
  spaces: ReservationSpace[];
}) {
  const space = spaces.find((s) => s.id === event.trainerId);
  const start = new Date(event.start);
  const end = new Date(event.end);

  return (
    <div className="flex flex-col gap-4 p-4 text-white">
      <div>
        <h2 className="text-lg font-semibold">{event.title || event.serviceName}</h2>
        {event.description && <p className="mt-1 text-sm text-white/70">{event.description}</p>}
      </div>
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-white/50">Time</dt>
          <dd>
            {format(start, "h:mm a")} – {format(end, "h:mm a")}
          </dd>
        </div>
        {space && (
          <div className="flex justify-between gap-4">
            <dt className="text-white/50">Court / Space</dt>
            <dd>
              {space.name} ({space.type})
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

interface ReservationsDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventCreate: (startTime: Date, spaceId?: string) => void;
}

interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
  columnIndex: number;
  totalColumns: number;
}

export function ReservationsDayView({
  currentDate,
  events,
  onEventCreate,
}: ReservationsDayViewProps) {
  const dh = useDatesHandler();
  const locationIds = useStudioSelectedLocationIds();
  const { openSidebar } = useSidebarActions();
  const { updateSelectedEvent } = useCalendarActions();
  const { currentSelectedEvent } = useCalendarState();
  const [currentSelectedSpaceId, setCurrentSelectedSpaceId] = useState<string | null>(null);
  const [selectionSource, setSelectionSource] = useState<"grid" | "event" | null>(null);

  // Fetch courts from API
  const courtsQuery = trpc.courtArea.list.useQuery({
    locationIds,
    activeOnly: true,
  });

  // Transform API courts to spaces format
  const allSpaces: ReservationSpace[] = useMemo(() => {
    return (courtsQuery.data ?? []).map((court) => ({
      id: court.id,
      name: court.name,
      type: court.courtType === "INDOOR" ? "Indoor" : "Outdoor",
    }));
  }, [courtsQuery.data]);

  const selectedSpaceId = dh.selectedSpaceId;
  const spaces = useMemo(() => {
    if (selectedSpaceId === RESERVATIONS_SPACE_ALL) return allSpaces;
    const space = allSpaces.find((s) => s.id === selectedSpaceId);
    return space ? [space] : allSpaces;
  }, [selectedSpaceId, allSpaces]);

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  const processedSpaceEvents = useMemo(() => {
    return spaces.map((space) => {
      const spaceEvents = events.filter((e) => e.trainerId === space.id);
      const sorted = [...spaceEvents].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

      const positionedEvents: PositionedEvent[] = [];
      const columns: { event: CalendarEvent; end: Date }[][] = [];
      const dayStart = startOfDay(currentDate);
      const dayEnd = addHours(dayStart, 24);

      for (const event of sorted) {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const adjustedStart = eventStart;
        const adjustedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

        const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
        const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;
        const top = (startHour - StartHour) * WeekCellsHeight;
        const height = (endHour - startHour) * WeekCellsHeight;

        let columnIndex = 0;
        let placed = false;
        while (!placed) {
          const col = columns[columnIndex] ?? [];
          if (
            !col.some((c) =>
              areIntervalsOverlapping(
                { start: adjustedStart, end: adjustedEnd },
                { start: new Date(c.event.start), end: new Date(c.event.end) },
              ),
            )
          ) {
            placed = true;
          } else {
            columnIndex++;
          }
        }
        columns[columnIndex] = columns[columnIndex] ?? [];
        columns[columnIndex].push({ event, end: adjustedEnd });

        const width = 1 / columns.length;
        const left = columnIndex * width;
        positionedEvents.push({
          event,
          top,
          height,
          left,
          width,
          zIndex: 10 + columnIndex,
          totalColumns: columns.length,
          columnIndex,
        });
      }
      return positionedEvents;
    });
  }, [spaces, events, currentDate]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectionSource("event");
    if (locationIds.length === 1) {
      updateSelectedEvent(event);
      openSidebar({
        label: "Reservation Details",
        content: <ReservationDetailsContent event={event} spaces={allSpaces} />,
      });
    } else {
      toast({
        description: "Please select a location at the top.",
        variant: "destructive",
      });
    }
  };

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(currentDate, "day");

  const minColumnWidth = 200;
  const gridMinWidth = 64 + spaces.length * minColumnWidth;

  // Show loading state while fetching courts
  if (courtsQuery.isPending) {
    return (
      <div
        data-slot="reservations-day-view"
        className="relative top-[72px] flex h-full min-w-0 flex-1 flex-col items-center justify-center"
      >
        <DotRevolve width={32} height={32} />
      </div>
    );
  }

  return (
    <div
      data-slot="reservations-day-view"
      className="relative top-[72px] flex h-full min-w-0 flex-1 flex-col"
    >
      <div
        className={`sticky top-[146px] z-30 overflow-x-auto bg-background ${spaces.length ? "border-b border-white/7" : ""}`}
        style={{ paddingLeft: spaces.length ? 64 : 63 }}
      >
        <div
          className="grid h-[84px] grid-flow-col border-l border-white/7 bg-background uppercase"
          style={{
            gridTemplateColumns:
              spaces.length > 0
                ? `repeat(${spaces.length}, minmax(${minColumnWidth}px, 1fr))`
                : undefined,
            minWidth: spaces.length ? gridMinWidth - 64 : undefined,
            width: "100%",
          }}
        >
          {spaces.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-6 text-sm text-white/70 capitalize">
              No spaces available
            </div>
          ) : (
            spaces.map((space) => (
              <div
                key={space.id}
                className="flex min-w-0 flex-row items-center gap-3 border-r border-white/7 px-4"
              >
                <div className="flex min-w-0 flex-col">
                  <p className="text-sm font-normal uppercase">{space.name}</p>
                  <p className="text-xs font-normal text-white/50">({space.type})</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {spaces.length > 0 && (
        <div className="relative min-h-0 flex-1 overflow-x-auto overflow-y-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `64px repeat(${spaces.length}, minmax(${minColumnWidth}px, 1fr))`,
              minWidth: gridMinWidth,
              width: "100%",
            }}
          >
            <div>
              {hours.map((hour) => (
                <div
                  key={hour.toString()}
                  className="relative h-[var(--week-cells-height)] border-r border-b border-white/7 last:border-b-0"
                >
                  <span className="absolute top-[5px] right-[11px] left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background text-xs text-white/75 sm:pe-4 sm:text-xs">
                    {format(hour, "h a")}
                  </span>
                </div>
              ))}
            </div>

            {spaces.map((space, spaceIndex) => (
              <div key={space.id} className="relative">
                {/* Events first (below grid) – same order as team-day-view */}
                {(processedSpaceEvents[spaceIndex] ?? []).map((positionedEvent) => (
                  <div
                    key={positionedEvent.event.id}
                    className={cn(
                      "absolute",
                      positionedEvent.columnIndex === positionedEvent.totalColumns - 1 &&
                        "pr-[16px]",
                    )}
                    style={{
                      top: `${positionedEvent.top}px`,
                      height: `${positionedEvent.height}px`,
                      left: `${positionedEvent.left * 100}%`,
                      width: `${positionedEvent.width * 100}%`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="h-full w-full">
                      <DraggableEvent
                        event={positionedEvent.event}
                        view="week"
                        onClick={(e) => handleEventClick(positionedEvent.event, e)}
                        showTime
                        height={positionedEvent.height - 14}
                      />
                    </div>
                  </div>
                ))}

                {/* Time grid on top – selection shows border, event goes to background */}
                {hours.map((hour) => {
                  const hourValue = getHours(hour);
                  const eventStart =
                    (currentSelectedEvent as { startTime?: string; start?: Date } | null)?.start ??
                    (currentSelectedEvent as { startTime?: string; start?: Date } | null)
                      ?.startTime;
                  const selectedDate =
                    eventStart &&
                    (typeof eventStart === "string" ? new Date(eventStart) : eventStart);
                  const selectedSpaceId = (currentSelectedEvent as { trainerId?: string } | null)
                    ?.trainerId;
                  const shouldHighlight =
                    !!selectedDate &&
                    selectionSource === "grid" &&
                    currentDate.getTime() === startOfDay(selectedDate).getTime() &&
                    getHours(selectedDate) === hourValue &&
                    selectedSpaceId === space.id;

                  return (
                    <div
                      key={hour.toString()}
                      className={cn(
                        "relative min-h-[var(--week-cells-height)] border-r border-b border-white/7 last:border-b-0",
                      )}
                      style={
                        shouldHighlight
                          ? {
                              border: "2px solid var(--primary)",
                              position: "relative",
                              zIndex: 11,
                              backgroundColor: "var(--background)",
                            }
                          : undefined
                      }
                    >
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
                      {[0, 1, 2, 3].map((quarter, index) => {
                        const quarterHourTime = hourValue + quarter * 0.25;
                        return (
                          <DroppableCell
                            key={`res-cell-${space.id}-${currentDate.toISOString()}-${quarterHourTime}`}
                            id={`reservations-cell-${space.id}-${currentDate.toISOString()}-${quarterHourTime}`}
                            date={currentDate}
                            time={quarterHourTime}
                            className={cn(
                              "absolute h-[calc(var(--week-cells-height)/4)] w-full cursor-pointer",
                              quarter === 0 && "top-0",
                              quarter === 1 && "top-[calc(var(--week-cells-height)/4)]",
                              quarter === 2 && "top-[calc(var(--week-cells-height)/4*2)]",
                              quarter === 3 && "top-[calc(var(--week-cells-height)/4*3)]",
                            )}
                            onClick={() => {
                              const startTime = new Date(currentDate);
                              startTime.setHours(hourValue);
                              startTime.setMinutes(quarter * 15);
                              setSelectionSource("grid");
                              setCurrentSelectedSpaceId(space.id);
                              onEventCreate(startTime, space.id);
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

          {currentTimeVisible && (
            <div
              className="pointer-events-none absolute right-0 left-[65px] z-10"
              style={{ top: `calc(${currentTimePosition}% + 2px)` }}
            >
              <div className="relative flex items-center">
                <div className="absolute -left-1 h-2 w-2 rotate-45 bg-primary" />
                <div className="h-[2px] w-full bg-primary" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
