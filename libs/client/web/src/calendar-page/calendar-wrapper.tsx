import { useEffect, type ReactNode } from "react";

import { ButtonPlus, SimpleSelect, toast } from "@train-on/client-ui";
import { cn, useStudioSelectedLocationIds, useWidthStore } from "@train-on/client-utils";

import { CalendarControls } from "../components/calendar/calendar-controls";
import { SharedSearchBar } from "../components/shared-searchbar/shared-searchbar";
import { useSidebarActions } from "../right-sidebar/use-sidebar-store";
import { CalendarSidebar } from "./calendar-sidebar";
import { services, useDatesHandler } from "./dates-utils";
import { useHasScrolled } from "./use-has-scrolled";

export const CalendarWrapper = ({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) => {
  const locationIds = useStudioSelectedLocationIds();
  const { widthForHeader } = useWidthStore();

  const dh = useDatesHandler();

  const { openSidebar, closeSidebar } = useSidebarActions();

  const hasScrolled = useHasScrolled();

  // biome-ignore lint/correctness/useExhaustiveDependencies: close sidebar when page is reloaded
  useEffect(() => {
    closeSidebar();
  }, []);

  const handleAddEvent = () => {
    if (locationIds.length === 1) {
      openSidebar({
        label: "Add Event",
        content: <CalendarSidebar clickedTimeSlot={new Date()} />,
      });
    } else {
      toast({
        description: "To add an event, please select a location at the top.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div
        className="sticky top-[73px] left-[248px] z-30 flex flex-col bg-background"
        style={{ minWidth: widthForHeader, maxWidth: widthForHeader }}
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
            />
            <div className="flex flex-1 items-center justify-end gap-[24px]">
              <SharedSearchBar />
              <div className="flex flex-row items-center">
                <SimpleSelect
                  options={services.map((service) => ({
                    value: service,
                    label: service,
                  }))}
                  value={dh.selectedService}
                  className="px-0"
                  contentClassName="capitalize"
                  onValueChange={(val) => dh.setSelectedService(val)}
                />
              </div>
              <div className="flex flex-row items-center">
                <SimpleSelect
                  value="my calendar"
                  options={[
                    { value: "my calendar", label: "my calendar" },
                    { value: "team", label: "team" },
                  ]}
                  className="px-0"
                  contentClassName="capitalize"
                />
              </div>
              <ButtonPlus size="xs" onClick={handleAddEvent} className="mr-1">
                Add
              </ButtonPlus>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[146px] z-21 pl-[56px]">
        <div
          className={cn(
            "flex w-full flex-row border-b-[1px] border-l-[1px] border-b-white/7 border-l-white/7 bg-background",
            hasScrolled ? "shadow-[6px_5px_20px_5px_#0000003b]" : "shadow-none",
          )}
        >
          {header}
        </div>
      </div>

      <div className="relative">{children}</div>
    </div>
  );
};
