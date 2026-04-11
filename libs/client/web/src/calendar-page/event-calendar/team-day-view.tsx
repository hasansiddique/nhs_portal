import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  format,
  getHours,
  getMinutes,
  startOfDay,
} from "date-fns";
import type React from "react";
import { useMemo, useState } from "react";

import { DotRevolve, toast, UserAvatar } from "@train-on/client-ui";
import { cn, trpc, useStudioSelectedLocationIds } from "@train-on/client-utils";

import { EventDetailsPage } from "../../events/view-event/event-details-page";
import { useSidebarActions } from "../../right-sidebar/use-sidebar-store";
import { useDatesHandler } from "../dates-utils";
import { useCalendarActions, useCalendarState } from "../use-calendar-store";
import { EndHour, StartHour } from "./constants";
import {
  DraggableEvent,
  DroppableCell,
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
  columnIndex: number;
  totalColumns: number;
}

type SelectionSource = "grid" | "event" | null;

export function TeamDayView({ currentDate, events, onEventCreate }: WeekViewProps) {
  const dh = useDatesHandler();
  const locationIds = useStudioSelectedLocationIds();
  const { openSidebar } = useSidebarActions();
  const { updateSelectedEvent } = useCalendarActions();

  const { currentSelectedEvent } = useCalendarState();
  const [selectionSource, setSelectionSource] = useState<SelectionSource>(null);
  const [currentSelectedTrainerId, setCurrentSelectedTrainerId] = useState("");

  const allEmployees = trpc.settings.employees.getAllEmployees.useQuery({
    locationIds: locationIds,
    isActive: true,
    q: "",
    orderBy: "firstName",
  });

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  const _filteredEmployees = useMemo(() => {
    const all = allEmployees?.data?.employees ?? [];
    const locationIdSet = new Set(locationIds);

    return dh.myCalendar === "team"
      ? all
      : all.filter((employee) => {
          const isAssignedToActiveClub = employee.clubs?.some(
            (club) => club.isActive && locationIdSet.has(club.id),
          );

          const isTrainer = employee.roles?.includes("trainer");

          return isAssignedToActiveClub && isTrainer;
        });
  }, [allEmployees?.data?.employees, locationIds, dh.myCalendar]);

  const filteredEmployees = useMemo(() => {
    return [
      ..._filteredEmployees.sort((a, b) => {
        // get employees with events first, then sort by name
        const aEvents = events.filter((event) => event.trainerId === a.id).length;
        const bEvents = events.filter((event) => event.trainerId === b.id).length;

        if (aEvents > bEvents) return -1;
        if (aEvents < bEvents) return 1;

        return a.firstName.localeCompare(b.firstName);
      }),
    ];
  }, [_filteredEmployees, events]);

  const processedEmployeeEvents = useMemo(() => {
    return filteredEmployees.map((employee) => {
      const employeeEvents = events.filter((event) => event.trainerId === employee.id);

      const sortedEvents = [...employeeEvents].sort((a, b) => {
        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        const aEnd = new Date(a.end);
        const bEnd = new Date(b.end);

        if (aStart < bStart) return -1;
        if (aStart > bStart) return 1;

        const aDuration = differenceInMinutes(aEnd, aStart);
        const bDuration = differenceInMinutes(bEnd, bStart);
        return bDuration - aDuration;
      });

      const positionedEvents: PositionedEvent[] = [];
      const columns: { event: CalendarEvent; end: Date }[][] = [];

      for (const event of sortedEvents) {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        const dayStart = startOfDay(eventStart);
        const dayEnd = addHours(dayStart, 24);

        const adjustedStart = eventStart;
        const adjustedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

        const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
        const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;

        const top = (startHour - StartHour) * WeekCellsHeight;
        const height = (endHour - startHour) * WeekCellsHeight;

        let columnIndex = 0;
        let placed = false;

        while (!placed) {
          const col = columns[columnIndex] || [];
          if (
            !col.some((c) =>
              areIntervalsOverlapping(
                { start: adjustedStart, end: adjustedEnd },
                {
                  start: new Date(c.event.start),
                  end: new Date(c.event.end),
                },
              ),
            )
          ) {
            placed = true;
          } else {
            columnIndex++;
          }
        }

        columns[columnIndex] = columns[columnIndex] || [];
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
  }, [filteredEmployees, events]);

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

  const employeesCount = filteredEmployees?.length ?? 0;

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(currentDate, "day");

  return allEmployees.isFetching ? (
    <div className="flex h-[90vh] flex-col items-center justify-center">
      <DotRevolve />
    </div>
  ) : (
    <div data-slot="team-day-view" className="relative top-[72px] flex h-full flex-col">
      <div
        className={`sticky top-[146px] z-30 overflow-x-auto bg-background pl-[63px] ${filteredEmployees.length && "border-b border-white/7"}`}
      >
        <div
          className="grid h-[84px] grid-flow-col border-l border-white/7 bg-background uppercase"
          style={{
            gridAutoColumns: "minmax(0, 1fr)",
            maxWidth: `${filteredEmployees.length * 264.25}px`,
            width: "100%",
          }}
        >
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-6 text-sm text-white/70 capitalize">
              No active employees found for selected location
            </div>
          ) : (
            filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex max-w-[264px] flex-row items-center gap-3 border-r border-white/7 px-4"
              >
                <UserAvatar
                  size={8}
                  url={employee.imageUrl}
                  name={`${employee.firstName} ${employee.lastName}`}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-normal uppercase">
                    {`${employee.firstName} ${employee.lastName}`}
                  </p>
                  {/*<p className="truncate text-sm font-normal text-white/50">100%</p>*/}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {filteredEmployees.length ? (
        <div className="relative flex-1 overflow-x-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `64px repeat(${employeesCount}, minmax(264px, 1fr))`,
              width: `${64 + employeesCount * 264}px`,
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

            {allEmployees?.data?.employees.map((employee, empIndex) => (
              <div key={employee.id} className="relative">
                {(processedEmployeeEvents[empIndex] ?? []).map((positionedEvent) => (
                  <div
                    key={positionedEvent.event.id}
                    className={`absolute ${positionedEvent.columnIndex === positionedEvent.totalColumns - 1 ? "pr-[16px]" : ""}`}
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
                        onClick={(e) => {
                          console.log("==========DETAILS CLICKED");
                          handleEventClick(positionedEvent.event, e);
                        }}
                        showTime
                        height={positionedEvent.height - 14}
                      />
                    </div>
                  </div>
                ))}

                {hours.map((hour) => {
                  const hourValue = getHours(hour);

                  const eventStart =
                    (currentSelectedEvent as any)?.startTime ??
                    (currentSelectedEvent as any)?.start ??
                    null;

                  const shouldHighlight =
                    !!eventStart &&
                    selectionSource === "grid" &&
                    getHours(eventStart) === hourValue &&
                    currentSelectedTrainerId === employee.id;

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
                      {[0, 1, 2, 3].map((quarter, index) => {
                        const quarterHourTime = hourValue + quarter * 0.25;

                        return (
                          <DroppableCell
                            key={`${hour.toString()}-${quarter}-${employee.id}`}
                            id={`team-day-cell-${employee.id}-${currentDate.toISOString()}-${quarterHourTime}`}
                            date={currentDate}
                            time={quarterHourTime}
                            className={cn(
                              "absolute h-[calc(var(--week-cells-height)/4)] w-full",
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
                              setCurrentSelectedTrainerId(employee.id);
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
      ) : null}
    </div>
  );
}
