"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { differenceInMinutes, format, getMinutes, isPast } from "date-fns";
import { useMemo } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@train-on/client-ui";
import { cn } from "@train-on/client-utils";

import { CalendarAvatar } from "../../events/ui";
import { useCalendarState } from "../use-calendar-store";
import type { CalendarEvent } from "./index";

// Using date-fns format with custom formatting:
// 'h' - hours (1-12)
// 'a' - am/pm
// ':mm' - minutes with leading zero (only if the token 'mm' is present)
const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? "ha" : "h:mma").toLowerCase();
};

interface EventWrapperProps {
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  currentTime?: Date;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

// Shared wrapper component for event styling
function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  const { currentSelectedEvent } = useCalendarState();

  const displayEnd = currentTime
    ? new Date(
        new Date(currentTime).getTime() +
          (new Date(event.end).getTime() - new Date(event.start).getTime()),
      )
    : new Date(event.end);

  const isEventInPast = isPast(displayEnd);
  const isEventCompleted =
    isEventInPast && event.people.every((e) => e.attendanceState === "CONFIRMED");

  return (
    <div
      className="h-full"
      style={{
        zIndex: 10,
        background: "#10101D",
        position: "relative",
        borderLeft: `2px solid transparent`,
        borderRight: `2px solid transparent`,
        borderBottom: `2px solid transparent`,
        ...(currentSelectedEvent?.id === event?.id && {
          borderLeft: `2px solid ${event.color}`,
          borderRight: `2px solid ${event.color}`,
          borderBottom: `2px solid ${event.color}`,
          borderTop: `4px solid ${event.color}`,
        }),
      }}
    >
      <button
        className={cn(
          "flex h-full w-full overflow-hidden text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-dragging:shadow-lg",
          className,
        )}
        style={{
          ["--event-color" as any]: event.color,
          borderTop: currentSelectedEvent?.id === event?.id ? "none" : `4px solid ${event.color}`,
          backgroundColor: `${event.color}1A`,
          opacity: isEventCompleted ? 0.5 : 1,
        }}
        data-dragging={isDragging || undefined}
        data-past-event={isEventInPast || undefined}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        {...dndListeners}
        {...dndAttributes}
      >
        {children}
      </button>
    </div>
  );
}

function EventWrapperMonth({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  const displayEnd = currentTime
    ? new Date(
        new Date(currentTime).getTime() +
          (new Date(event.end).getTime() - new Date(event.start).getTime()),
      )
    : new Date(event.end);

  const isEventInPast = isPast(displayEnd);

  return (
    <button
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  );
}

interface EventItemProps {
  event: CalendarEvent;
  view: "month" | "week" | "day";
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  currentTime?: Date;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  children?: React.ReactNode;
  className?: string;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

export function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  const displayStart = useMemo(() => {
    return currentTime || new Date(event.start);
  }, [currentTime, event.start]);

  const displayEnd = useMemo(() => {
    return currentTime
      ? new Date(
          new Date(currentTime).getTime() +
            (new Date(event.end).getTime() - new Date(event.start).getTime()),
        )
      : new Date(event.end);
  }, [currentTime, event.start, event.end]);

  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart);
  }, [displayStart, displayEnd]);

  const isShift = event?.serviceName?.toLowerCase() === "shift";

  if (view === "month") {
    const formattedTime = new Date(event.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <EventWrapperMonth
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children || (
          <div className="mx-[8px] flex h-[16px] cursor-pointer items-center">
            <div
              style={{ backgroundColor: event.color }}
              className="h-[6px] w-[6px] rounded-full"
            />
            <span className="ml-[6px] text-[12px] leading-[16px] text-white/50">
              {formattedTime}
            </span>
            <span className="mx-[6px] text-white/50">-</span>
            <span className="flex-1 truncate text-[12px] leading-[16px] capitalize">
              {isShift ? "Front Desk" : event.trainerName || event.serviceName || event.title}
            </span>
          </div>
        )}
      </EventWrapperMonth>
    );
  }

  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          durationMinutes < 45 ? "items-center" : "flex-col",
          view === "week" ? "text-[10px] sm:text-[14px]" : "text-[14px]",
          className,
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {isShift ? (
          <div className="w-[161px] px-[8px] pt-[2px] pb-[4px]">
            <p className="text-sm font-normal text-white capitalize">{event.trainerName}</p>
          </div>
        ) : (
          <>
            {view === "day" && <DayViewCard event={event} durationMinutes={durationMinutes} />}
            {view === "week" && <WeekViewCard event={event} durationMinutes={durationMinutes} />}
          </>
        )}
      </EventWrapper>
    );
  }
}

const DayViewCard = ({
  event,
  durationMinutes,
}: {
  event: CalendarEvent;
  durationMinutes: number;
}) => {
  return (
    <div className="flex h-full w-full flex-col justify-between px-[8px] pt-[2px] pb-[4px]">
      <div className="flex flex-row justify-between gap-[2px]">
        <p className="text-sm font-normal text-white">
          {event.serviceName}
          {event.isReceptionist}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {durationMinutes >= 30 && <CalendarAvatar people={event.people} />}
        {durationMinutes >= 59 && <p className="text-xs font-normal text-white/50">{event.room}</p>}
      </div>
    </div>
  );
};

const WeekViewCard = ({
  event,
  durationMinutes,
}: {
  event: CalendarEvent;
  durationMinutes: number;
}) => {
  return (
    <Tooltip key={event.id}>
      <TooltipTrigger asChild>
        <div className="flex h-full w-full flex-col justify-between px-[8px] pt-[2px] pb-[4px]">
          <div className="flex flex-col gap-[2px]">
            <p className="text-sm font-normal text-white">
              {event.serviceName}
              {event.isReceptionist}
            </p>

            {durationMinutes > 59 && (
              <p className="text-xs font-normal text-white/50">{durationMinutes} Mins</p>
            )}

            {durationMinutes >= 59 && (
              <p className="text-xs font-normal text-white/50">{event.room}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {durationMinutes >= 30 && <CalendarAvatar people={event.people} />}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        <p className="text-center font-semibold">{event.serviceName}</p>
        <p className="text-center text-sm text-white/50">{`${event.trainerName}, ${event?.people?.length} booked`}</p>
      </TooltipContent>
    </Tooltip>
  );
};
