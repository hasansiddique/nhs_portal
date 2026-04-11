import { format, isSameDay } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";

import { toast } from "@train-on/client-ui";
import { cn, useStudioSelectedLocationIds } from "@train-on/client-utils";

import { CalendarEventItemRenderer } from "../events/ui";
import { EventDetailsPage } from "../events/view-event/event-details-page";
import { useSidebarActions } from "../right-sidebar/use-sidebar-store";
import { CalendarSidebar } from "./calendar-sidebar";

export type EventType = {
  id: string;
  trainerName: string;
  trainerId: string;
  trainerImageUrl: string | null | undefined;
  confirmed: boolean;
  serviceName: string;
  serviceIsManyClientsAllowed: boolean;
  serviceIsFree: boolean;
  isReceptionist: boolean;
  people: {
    name: string;
    imageUrl: string | null;
    id: string;
  }[];
  status: string;
  class: string;
  totalPay: string;
  actualPay: string;
  startTime: Date;
  endTime: Date;
};

type TransformedEventType = {
  key: string;
  events: EventType[][];
};

export type EventTypeForDay = {
  id: string;
  confirmed: boolean;
  serviceName: string;
  isReceptionist: boolean;
  people: {
    name: string;
    imageUrl: string | null;
    id: string;
  }[];
  trainerId: string;
  trainerName: string;
  class: string;
  totalPay: string;
  actualPay: string;
  startTime: Date;
  endTime: Date;
};

const HourDivider = ({ hour }: { hour: string }) => {
  return (
    <div>
      <div className="z-0 mt-[-18px] h-px w-full bg-white/10" />
      <div className="relative">
        <p className="sticky left-64 z-13 h-[15px] w-[45px] shrink-0 pt-[5px] text-sm leading-4 font-normal text-white/75">
          {hour.replace(/^0/, "")}
        </p>
        <div className="fixed top-0 left-60 z-12 h-full w-[65px] border-r-[1px] border-r-white/7 bg-background" />
      </div>
    </div>
  );
};

const EventColumn = ({
  events,
  isDaySelected,
}: {
  events: EventType[][];
  isDaySelected: boolean;
}) => {
  return (
    <div className="z-50 ml-[57px] flex flex-row">
      {events.map((events2, index) => {
        if (events2.length > 1) {
          return (
            <div key={index} className="flex h-[116px] flex-col">
              {events2.map((event, innerIndex) => {
                if (innerIndex === 0)
                  return (
                    <div key={event.id} className="ml-3 flex w-full flex-col">
                      <EventItem event={event} isDaySelected={isDaySelected} />
                    </div>
                  );
                return (
                  <div key={event.id} className="ml-3 flex w-full flex-col">
                    <EventItem event={event} isDaySelected={isDaySelected} />
                  </div>
                );
              })}
            </div>
          );
        }
        return events2.map((event, innerIndex) => {
          if (!event.id)
            return (
              <div
                key={innerIndex}
                className={`ml-0 h-[120px] ${isDaySelected ? "border-r-none w-[264px]" : "w-[152px] border-r-[1px] border-r-white/7"} `}
              />
            );
          if (event.id === "")
            return (
              <div
                key={innerIndex}
                className={`ml-0 h-[120px] ${isDaySelected ? "border-r-none w-[264px]" : "w-[152px] border-r-[1px] border-r-white/7"} `}
              />
            );
          return (
            <div
              key={event.id}
              className={`ml-0 flex h-[120px] ${isDaySelected ? "w-full" : ""} flex-col`}
            >
              <EventItem event={event} isDaySelected={isDaySelected} />
            </div>
          );
        });
      })}
    </div>
  );
};

const EventItem = ({ event, isDaySelected }: { event: EventType; isDaySelected: boolean }) => {
  const locationIds = useStudioSelectedLocationIds();
  const { openSidebar } = useSidebarActions();

  const handleOpenEventDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (locationIds.length === 1) {
      openSidebar({ label: "Event Details", content: <EventDetailsPage eventId={event.id} /> });
    } else {
      toast({
        description: "To add an event, please select a location at the top.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "relative text-left",
        event.status === "COMPLETED" ? "opacity-50 transition-opacity hover:opacity-80" : "",
      )}
    >
      <CalendarEventItemRenderer
        startAt={event.startTime}
        endAt={
          isSameDay(event.startTime, event.endTime)
            ? event.endTime
            : new Date(
                event.startTime.getFullYear(),
                event.startTime.getMonth(),
                event.startTime.getDate(),
                23,
                59,
              )
        }
        people={event.people}
        id={event.id}
        title={event.trainerName}
        confirmed={event.confirmed}
        isColoredTopBorder={true}
        serviceName={event.serviceName}
        serviceIsManyClientsAllowed={event.serviceIsManyClientsAllowed}
        serviceIsFree={event.serviceIsFree}
        room={event.class}
        actualPay={event.actualPay}
        totalPay={event.totalPay}
        key={event.id}
        isReceptionist={event.isReceptionist}
        calendarView={true}
        isDaySelected={isDaySelected}
      />
      {event.serviceName !== "shift" && (
        <button className="absolute inset-0" onClick={handleOpenEventDetails} type="button">
          <span className="sr-only">Open event details</span>
        </button>
      )}
    </div>
  );
};

function mapMinutesToRange(minutes: number, newMax: number) {
  const originalMin = 0;
  const originalMax = 59;
  const newMin = 0;

  // Calculate the range ratios
  const rangeRatio = (newMax - newMin) / (originalMax - originalMin);

  // Map the input minutes to the new range
  const mappedToRange = (minutes - originalMin) * rangeRatio;

  // Add the minimum value of the new range
  const mappedValue = mappedToRange + newMin;

  return mappedValue;
}

const TimelineItem = ({
  hour,
  events,
  isDaySelected,
}: {
  hour: string;
  events: EventType[][];
  isDaySelected: boolean;
}) => {
  const [minutes, setMinutes] = useState(0);
  const [currentHour, setCurrentHour] = useState(format(new Date(), "hh aa"));
  const dividerRef = useRef<HTMLDivElement>(null);
  const timeIndicatorRef = useRef<HTMLDivElement>(null);

  const { openSidebar } = useSidebarActions();

  useEffect(() => {
    const updateMinutes = () => {
      if (dividerRef.current) {
        const now = new Date();
        const mappedMinutes = mapMinutesToRange(
          now.getMinutes(),
          dividerRef.current.clientHeight - 22,
        );
        setMinutes(mappedMinutes);
        const newHour = format(now, "hh aa");
        if (newHour !== currentHour) {
          setCurrentHour(newHour);
        }
      }
    };

    updateMinutes();
    const intervalId = setInterval(updateMinutes, 60000);

    return () => clearInterval(intervalId);
  }, [currentHour, dividerRef.current?.clientHeight]);

  useEffect(() => {
    if (timeIndicatorRef.current) {
      const parentElement = timeIndicatorRef.current.parentElement;
      if (parentElement) {
        timeIndicatorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, []);

  const isOnTime = currentHour === hour;

  return (
    <div
      ref={dividerRef}
      key={hour}
      className="relative pr-8 text-[12px]"
      onClick={() => {
        openSidebar({ label: "Add Event", content: <CalendarSidebar clickedTimeSlot={hour} /> });
      }}
    >
      {isOnTime && (
        <div
          className="absolute z-13 flex w-full flex-row flex-nowrap items-center"
          style={{ marginTop: `${minutes}px` }}
        >
          <div
            ref={timeIndicatorRef}
            className="z-10 ml-[60px] h-2 w-2 rotate-45 transform bg-cerulean-blue-1"
          />
          <div className="z-10 h-px min-w-[calc(100%-100px)] bg-cerulean-blue-1" />
        </div>
      )}
      <HourDivider hour={hour} />
      <EventColumn events={events} isDaySelected={isDaySelected} />
    </div>
  );
};

export const Timeline = ({
  timeSlots,
  isDaySelected,
}: {
  timeSlots: Map<string, EventType[]>;
  isDaySelected: boolean;
}) => {
  const x = useMemo(() => {
    const transformedEvents: TransformedEventType[] = [];

    const timeSlotsArr = Array.from(timeSlots);

    for (const [hour, events] of timeSlotsArr) {
      const transformedEventsArray: EventType[][] = [];
      let lastEvent: EventType | null = null;

      for (const evt of events) {
        if (
          lastEvent &&
          isSameDay(lastEvent.startTime, evt.startTime) &&
          lastEvent.startTime.getHours() === evt.startTime.getHours()
        ) {
          transformedEventsArray[transformedEventsArray.length - 1].push(evt);
        } else {
          const eventArray: EventType[] = [evt];
          transformedEventsArray.push(eventArray);
        }
        lastEvent = evt;
      }

      transformedEvents.push({ key: hour, events: transformedEventsArray });
    }

    const transformedEventsMap = new Map<string, EventType[][]>();
    for (const { key, events } of transformedEvents) {
      transformedEventsMap.set(key, events);
    }
    return Array.from(transformedEventsMap);
  }, [timeSlots]);

  return (
    <div>
      {x.map(([hour, events]) => {
        return (
          <TimelineItem isDaySelected={isDaySelected} key={hour} hour={hour} events={events} />
        );
      })}
    </div>
  );
};

export const TimelineForDayView = ({
  timeSlots,
  isDaySelected,
}: {
  timeSlots: Map<string, EventType[]>;
  isDaySelected: boolean;
}) => {
  const x = useMemo(() => {
    const transformedEvents: TransformedEventType[] = [];

    const timeSlotsArr = Array.from(timeSlots);

    const trainerIds = new Set<string>();
    for (const [, events] of timeSlotsArr) {
      for (const evt of events) {
        if (evt.trainerId) {
          trainerIds.add(evt.trainerId);
        }
      }
    }

    for (const [hour, events] of timeSlotsArr) {
      const transformedEventsArray: EventType[][] = Array.from(
        { length: trainerIds.size },
        () => [],
      );

      for (const evt of events) {
        if (evt.trainerId) {
          const trainerIndex = Array.from(trainerIds).findIndex((id) => id === evt.trainerId);

          if (trainerIndex !== -1) {
            const lastTrainerEvents = transformedEventsArray[trainerIndex];
            const lastEvent = lastTrainerEvents[lastTrainerEvents.length - 1];

            if (
              lastEvent &&
              lastEvent.trainerId === evt.trainerId &&
              isSameDay(lastEvent.startTime, evt.startTime) &&
              lastEvent.startTime.getHours() === evt.startTime.getHours()
            ) {
              lastTrainerEvents.push(evt);
            } else {
              transformedEventsArray[trainerIndex].push(evt);
            }
          }
        }
      }

      for (const trainerEvents of transformedEventsArray) {
        if (trainerEvents.length === 0) {
          trainerEvents.push({} as EventType);
        }
      }

      transformedEvents.push({ key: hour, events: transformedEventsArray });
    }

    const transformedEventsMap = new Map<string, EventType[][]>();
    for (const { key, events } of transformedEvents) {
      transformedEventsMap.set(key, events);
    }

    return Array.from(transformedEventsMap);
  }, [timeSlots]);

  return (
    <div>
      {x.map(([hour, events]) => {
        return (
          <TimelineItem isDaySelected={isDaySelected} key={hour} hour={hour} events={events} />
        );
      })}
    </div>
  );
};
