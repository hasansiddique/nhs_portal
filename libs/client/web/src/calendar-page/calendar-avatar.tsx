import { Tooltip, TooltipContent, TooltipTrigger, UserAvatar } from "@train-on/client-ui";

import { useClientSearchActions } from "../header/use-client-search-input-store";

export interface Profile {
  id: string;
  fullName: string;
  imageUrl: string | null;
}

export function CalendarAvatar({
  people,
  hidePlus,
  hideName,
}: {
  people: Profile[];
  hidePlus?: boolean;
  hideName?: boolean;
}) {
  const { selectClient } = useClientSearchActions();
  const first = people[0];

  if (people.length === 1)
    return (
      <button
        type="button"
        className="ml-3 flex w-[264px] flex-col items-start gap-2 hover:text-cerulean-blue-1 focus:outline-hidden"
        onClick={() => {
          selectClient({
            ...first,
            locationIds: [] as string[],
            phone: "",
            status: "ACTIVE",
          });
        }}
      >
        <div className="flex items-center gap-x-3">
          <UserAvatar
            size={8}
            className="border border-black"
            name={first.fullName}
            url={first.imageUrl}
          />
          <div>{!hideName && first.fullName}</div>
        </div>
      </button>
    );

  return (
    <div className="flex items-center gap-x-1">
      <div className="flex items-center -space-x-2.5">
        {people.map((p) => (
          <Tooltip key={p.id} delayDuration={10}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  selectClient({ ...p, locationIds: [] as string[], phone: "", status: "ACTIVE" });
                }}
              >
                <UserAvatar
                  size={8}
                  className="z-0 border border-black/20"
                  name={p.fullName}
                  url={p.imageUrl}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>{p.fullName}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {!hidePlus && people.length > 1 && `+${people.length}`}
    </div>
  );
}
