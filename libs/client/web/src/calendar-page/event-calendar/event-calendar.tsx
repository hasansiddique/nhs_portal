import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { ButtonPlus, DotRevolve, SimpleSelect, toast } from "@train-on/client-ui";
import { trpc, useStudioSelectedLocationIds, useWidthStore } from "@train-on/client-utils";

import { CalendarControls } from "../../components/calendar/calendar-controls";
import { useSidebarActions } from "../../right-sidebar/use-sidebar-store";
import { CalendarSidebar } from "../calendar-sidebar";
import { RESERVATIONS_SPACE_ALL, services, useDatesHandler } from "../dates-utils";
import { useCalendarActions } from "../use-calendar-store";
import {
  CalendarDndProvider,
  DayView,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
  type CalendarEvent,
} from "./index";
import { ReservationsDayView } from "./reservations-day-view";
import { SearchBarCalendar } from "./searchbar-calendar";
import { TeamDayView } from "./team-day-view";

export interface EventCalendarProps {
  events?: CalendarEvent[];
  isLoading?: boolean;
  onEventUpdate?: (event: CalendarEvent) => void;
}

export function EventCalendar({ events = [], isLoading, onEventUpdate }: EventCalendarProps) {
  const { pathname } = useLocation();

  // Use the shared calendar context instead of local state
  const dh = useDatesHandler();
  const { openSidebar, closeSidebar } = useSidebarActions();
  const { resetSelectedEvent } = useCalendarActions();
  const locationIds = useStudioSelectedLocationIds();
  const { widthForHeader } = useWidthStore();

  // Fetch courts for reservations view
  const isReservationsView = dh.selectedService === "reservations";
  const courtsQuery = trpc.courtArea.list.useQuery(
    { locationIds, activeOnly: true },
    { enabled: isReservationsView },
  );

  // Build spaces options from courts data
  const spaceOptions = useMemo(() => {
    const spaces = (courtsQuery.data ?? []).map((court) => ({
      value: court.id,
      label: court.name,
    }));
    return [{ value: RESERVATIONS_SPACE_ALL, label: "All Spaces" }, ...spaces];
  }, [courtsQuery.data]);

  const handleEventCreate = (startTime: Date, selectedSpaceId?: string) => {
    resetSelectedEvent();
    openSidebar({
      label: "Add Booking",
      content: <CalendarSidebar clickedTimeSlot={startTime} selectedSpaceId={selectedSpaceId} />,
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);
  };

  useEffect(() => {
    closeSidebar();
  }, []);

  const handleAddEvent = () => {
    if (locationIds.length === 1) {
      openSidebar({
        label: "Add Booking",
        content: <CalendarSidebar clickedTimeSlot={new Date()} />,
      });
    } else {
      toast({
        description: "To add a booking, please select a location at the top.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="flex flex-col rounded-lg has-data-[slot=month-view]:flex-1"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          style={{
            minWidth: widthForHeader,
            maxWidth: widthForHeader,
            ...(pathname.startsWith("/calendar") && { left: 320 }),
          }}
          className="sticky top-[73px] left-[248px] z-30 flex flex-col bg-background"
        >
          <div className="py-[16px]">
            <div className="flex flex-row items-center justify-between gap-3">
              <CalendarControls
                onPrev={dh.subDay}
                onNext={dh.addDay}
                selectedRange={dh.selectedRange}
                setSelectedRange={dh.setSelectedRange}
                dateOn={dh.dateOn}
                setDateOn={dh.setDateOn}
                startDate={dh.startDate.getDate()}
                endDate={dh.endDate.getDate()}
                showTodayButton={true}
                sideOffsetDatepicker={15}
                selectContentClassName="mt-2.5"
              />

              <div className="flex flex-1 items-center justify-end gap-[24px]">
                <SearchBarCalendar />

                <div className="flex flex-row items-center">
                  <SimpleSelect
                    options={services.map((service) => ({
                      value: service,
                      label: service.charAt(0).toUpperCase() + service.slice(1),
                    }))}
                    className="w-fit justify-start border-none px-0 capitalize"
                    value={dh.selectedService}
                    iconSize={12}
                    iconClassName="size-3 mt-[3px]"
                    contentClassName="max-w-[133px] capitalize min-w-[133px] mt-3"
                    onValueChange={(val) => dh.setSelectedService(val)}
                  />
                </div>

                <div className="flex flex-row items-center">
                  {dh.selectedService === "reservations" ? (
                    <SimpleSelect
                      value={dh.selectedSpaceId}
                      className="w-fit justify-start border-none px-0 capitalize"
                      options={spaceOptions}
                      iconSize={12}
                      iconClassName="size-3 mt-[3px]"
                      contentClassName="max-w-[133px] capitalize min-w-[133px] mt-3"
                      onValueChange={(val) => dh.setSelectedSpaceId(val)}
                    />
                  ) : (
                    <SimpleSelect
                      value={dh.myCalendar}
                      className="w-fit justify-start border-none px-0 capitalize"
                      options={[
                        { value: "my calendar", label: "my calendar" },
                        { value: "team", label: "team" },
                        { value: "trainer", label: "training" },
                      ]}
                      iconSize={12}
                      iconClassName="size-3 mt-[3px]"
                      contentClassName="max-w-[133px] capitalize min-w-[133px] mt-3"
                      onValueChange={(value) =>
                        dh.setMyCalendar(value as "my calendar" | "team" | "trainer")
                      }
                    />
                  )}
                </div>

                <ButtonPlus size="xs" onClick={handleAddEvent} className="mr-1">
                  Add
                </ButtonPlus>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/15" style={{ minWidth: widthForHeader }} />
        </div>

        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className="flex h-[90vh] flex-col items-center justify-center">
              <DotRevolve />
            </div>
          ) : (
            <>
              {dh.selectedRange === "month" && (
                <MonthView
                  events={events}
                  currentDate={dh.dateOn}
                  onEventCreate={handleEventCreate}
                />
              )}

              {dh.selectedRange === "week" && (
                <WeekView
                  events={events}
                  currentDate={dh.dateOn}
                  onEventCreate={handleEventCreate}
                />
              )}

              {dh.selectedService === "reservations" && dh.selectedRange === "day" && (
                <ReservationsDayView
                  events={events}
                  currentDate={dh.dateOn}
                  onEventCreate={handleEventCreate}
                />
              )}

              {dh.selectedService !== "reservations" &&
                dh.myCalendar === "my calendar" &&
                dh.selectedRange === "day" && (
                  <DayView
                    events={events}
                    currentDate={dh.dateOn}
                    onEventCreate={handleEventCreate}
                  />
                )}

              {dh.selectedService !== "reservations" &&
                (dh.myCalendar === "team" || dh.myCalendar === "trainer") &&
                dh.selectedRange === "day" && (
                  <TeamDayView
                    events={events}
                    currentDate={dh.dateOn}
                    onEventCreate={handleEventCreate}
                  />
                )}
            </>
          )}
        </div>
      </CalendarDndProvider>
    </div>
  );
}
