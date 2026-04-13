"use client";

import { endOfWeek, isSameDay, isWithinInterval, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

import { EndHour, StartHour } from "../constants";

export function useCurrentTimeIndicator(currentDate: Date, view: "day" | "week") {
  const [currentTimePosition, setCurrentTimePosition] = useState<number>(0);
  const [currentTimeVisible, setCurrentTimeVisible] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimePosition = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();

      // Handle times before StartHour (12 AM to 5 AM) by treating them as part of the extended day
      // Since EndHour = 29 (5 AM next day), times 0-4 should map to hours 24-28
      if (hours < StartHour) {
        hours = hours + 24; // Map 0-4 to 24-28
      }

      const totalMinutes = (hours - StartHour) * 60 + minutes;
      const dayStartMinutes = 0; // 12am (mapped to hour 24)
      const dayEndMinutes = (EndHour - StartHour) * 60; // 5am next day (hour 29)

      // Calculate position as percentage of day
      const position = ((totalMinutes - dayStartMinutes) / (dayEndMinutes - dayStartMinutes)) * 100;

      // Check if current day is in view based on the calendar view
      let isCurrentTimeVisible = false;

      if (view === "day") {
        isCurrentTimeVisible = isSameDay(now, currentDate);
      } else if (view === "week") {
        const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 });
        isCurrentTimeVisible = isWithinInterval(now, {
          start: startOfWeekDate,
          end: endOfWeekDate,
        });
      }

      setCurrentTimePosition(position);
      setCurrentTimeVisible(isCurrentTimeVisible);
    };

    // Calculate immediately
    calculateTimePosition();

    // Update every minute
    const interval = setInterval(calculateTimePosition, 60000);

    return () => clearInterval(interval);
  }, [currentDate, view]);

  return { currentTimePosition, currentTimeVisible };
}
