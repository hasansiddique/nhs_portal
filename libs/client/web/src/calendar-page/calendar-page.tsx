import { addHours, format, isToday, startOfDay, startOfHour } from "date-fns";
import { useMemo } from "react";

import { DotRevolve } from "@train-on/client-ui";
import { cn, trpc, useStudioSelectedLocationIds } from "@train-on/client-utils";

import { useClientSearchSelectedClient } from "../header/use-client-search-input-store";
import { CalendarAvatar, type Profile } from "./calendar-avatar";
import { CalendarWrapper } from "./calendar-wrapper";
import { Timeline, TimelineForDayView, type EventType, type EventTypeForDay } from "./components";
import { useDatesHandler } from "./dates-utils";

type Profiles = {
  [key: string]: Profile[];
};

type DayInfo = {
  startTime: string;
};

export const CalendarPage = () => {
  const locationIds = useStudioSelectedLocationIds();

  const dh = useDatesHandler();

  const client = useClientSearchSelectedClient();

  const calendarEventTrainer =
    trpc.service.receptionistEvent.getEventsForTrainerCalendarTimeLine.useQuery({
      eventType: dh.selectedService,
      startDate: dh.startDate,
      endDate: dh.endDate,
      myCalendar: dh.myCalendar === "my calendar",
      locationIds,
      ...(client && dh.selectedService !== "shifts" ? { searchedId: client.id } : {}),
    });

  const profilesAvatarByDay: Profiles = useMemo(() => {
    if (!calendarEventTrainer.data?.eventsForDay) return {};

    const updatedProfilesAvatarByDay: Profiles = {};

    for (const key in calendarEventTrainer.data.eventsForDay) {
      const [dateString] = key.split("___");
      const dateKey = new Date(dateString).getDate().toString();

      if (!updatedProfilesAvatarByDay[dateKey]) {
        updatedProfilesAvatarByDay[dateKey] = [];
      }

      for (const event of calendarEventTrainer.data.eventsForDay[key]) {
        if (event?.profile) {
          const existingProfile = updatedProfilesAvatarByDay[dateKey].some(
            (profile) => profile.id === event.profile.id,
          );

          if (!existingProfile) {
            updatedProfilesAvatarByDay[dateKey].push({
              id: event.profile.id,
              imageUrl: event.profile.imageUrl ?? "",
              fullName: event.profile.fullName,
            });
          }
        }
      }
    }

    return updatedProfilesAvatarByDay;
  }, [calendarEventTrainer.data?.eventsForDay]);

  const createEmptyEventType = (): EventType => ({
    id: "",
    trainerName: "",
    trainerId: "",
    trainerImageUrl: null,
    confirmed: false,
    serviceName: "",
    serviceIsFree: false,
    serviceIsManyClientsAllowed: false,
    isReceptionist: false,
    people: [],
    class: "",
    actualPay: "",
    totalPay: "",
    startTime: new Date(),
    endTime: new Date(),
    status: "",
  });

  const emptySlots: Map<string, EventType[]> = new Map<string, EventType[]>(
    Array.from({ length: 24 }, (_, index) => {
      const hour = index % 12 === 0 ? 12 : index % 12;
      const period = index < 12 ? "AM" : "PM";
      const formattedHour = hour.toString().padStart(2, "0");
      return [`${formattedHour} ${period}`, [createEmptyEventType()]] as [string, EventType[]];
    }),
  );

  const trainingDaysInfo: DayInfo[] = useMemo(() => {
    if (!calendarEventTrainer.data?.events) return [];

    const trainingDaysData: DayInfo[] = [];

    for (const dateKey in calendarEventTrainer.data?.events) {
      trainingDaysData.push({ startTime: dateKey });
    }
    return trainingDaysData;
  }, [calendarEventTrainer.data?.events]);

  const trainingDayInfo: DayInfo[] = useMemo(() => {
    if (!calendarEventTrainer.data?.eventsForDay) return [];

    const trainingDayData: DayInfo[] = [];

    for (const dateKey in calendarEventTrainer.data?.eventsForDay) {
      trainingDayData.push({ startTime: dateKey });
    }
    return trainingDayData;
  }, [calendarEventTrainer.data]);

  const allTimeSlotsForTrainer = useMemo(() => {
    const timeSlotsMap = new Map();

    for (const dayKey in calendarEventTrainer.data?.events) {
      const trainerEvents = calendarEventTrainer.data?.events[dayKey];
      const timeSlots = groupEventsByHourForTrainer(trainerEvents ?? []);
      for (const [hour, events] of timeSlots.entries()) {
        if (!timeSlotsMap.has(hour)) {
          timeSlotsMap.set(hour, []);
        }
        if (events.length === 0) {
          timeSlotsMap.get(hour)?.push({} as EventTypeForDay);
        } else {
          timeSlotsMap.get(hour)?.push(...events);
        }
      }
    }

    return timeSlotsMap;
  }, [calendarEventTrainer.data?.events]);

  const allTimeSlotsForTrainerForDay = useMemo(() => {
    const timeSlotsMap = new Map();

    for (const dayKey in calendarEventTrainer.data?.eventsForDay) {
      const trainerEvents = calendarEventTrainer.data?.eventsForDay[dayKey];
      const timeSlots = groupEventsByHourForTrainer(trainerEvents ?? []);
      for (const [hour, events] of timeSlots.entries()) {
        if (!timeSlotsMap.has(hour)) {
          timeSlotsMap.set(hour, []);
        }
        if (events.length === 0) {
          timeSlotsMap.get(hour)?.push({} as EventTypeForDay);
        } else {
          timeSlotsMap.get(hour)?.push(...events);
        }
      }
    }

    return timeSlotsMap;
  }, [calendarEventTrainer.data?.eventsForDay]);

  return (
    <CalendarWrapper
      header={trainingDaysInfo.map((day) => {
        const originalDate = new Date(day.startTime);
        const formattedDate = format(originalDate, "EEE, dd");
        return (
          <div
            key={day.startTime}
            className={`flex flex-col items-center pt-[9px] pb-[7px] ${dh.selectedRange === "week" || dh.selectedRange === "month" ? "w-[152px] border-r-[1px] border-r-white/7" : "w-[264px]"}`}
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

            {/*@hasiddiq - hiding now for my calendar view*/}
            {/* {!dh.myCalendar && false && (
              <div className="w-full">
                <CalendarAvatar
                  people={getUniqueProfilesByKey(
                    profilesAvatarByDay,
                    originalDate.getDate().toString(),
                  )}
                  hidePlus={true}
                  hideName={false}
                />
              </div>
            )} */}
          </div>
        );
      })}
    >
      {calendarEventTrainer.isPending ? (
        <div className="flex h-[90vh] flex-col items-center justify-center">
          <DotRevolve />
        </div>
      ) : allTimeSlotsForTrainerForDay.size > 0 ? (
        <div className="mt-[18px]">
          {/* <div
              className={cn(
                "gradient-bg fixed right-[60px] z-50 h-full w-[121px] shrink-0",
                selectedRange !== "day" ? "top-[160px]" : "top-[100px]",
              )}
            /> */}
          {dh.myCalendar === "my calendar" && dh.selectedRange === "day" ? (
            <TimelineForDayView
              isDaySelected={dh.selectedRange === "day"}
              timeSlots={allTimeSlotsForTrainerForDay}
            />
          ) : (
            <Timeline
              isDaySelected={dh.selectedRange === "day"}
              timeSlots={allTimeSlotsForTrainer}
            />
          )}
        </div>
      ) : (
        <>
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform bg-background p-4 text-cerulean-blue-1">
            No Events Scheduled
          </div>
          <Timeline isDaySelected={dh.selectedRange === "day"} timeSlots={emptySlots} />
        </>
      )}
    </CalendarWrapper>
  );
};

function getUniqueProfilesByKey(profiles: Profiles, key: string): Profile[] {
  const profilesForKey = profiles[key];

  if (!profilesForKey) {
    return [];
  }

  const uniqueProfilesMap = new Map<string, Profile>();

  for (const profile of profilesForKey) {
    if (!uniqueProfilesMap.has(profile.id)) {
      uniqueProfilesMap.set(profile.id, profile);
    }
  }

  return Array.from(uniqueProfilesMap.values());
}

function groupEventsByHourForTrainer(events: EventTypeForDay[]) {
  const timeSlots = new Map();

  // Generate time slots for each hour of the day
  const startTime = startOfDay(new Date());
  for (let i = 0; i < 24; i++) {
    const time = addHours(startTime, i);
    const hourKey = format(time, "hh aa");
    timeSlots.set(hourKey, []);
  }

  // Populate time slots with events
  for (const event of events) {
    const startHour = startOfHour(new Date(event.startTime));
    const hourKey = format(startHour, "hh aa");

    if (!timeSlots.has(hourKey)) {
      timeSlots.set(hourKey, []);
    }

    timeSlots.get(hourKey).push(event);
  }

  return timeSlots;
}
