import { UserAvatar } from "@train-on/client-ui";
import { trpc, useDebounce, useStudioSelectedLocationIds } from "@train-on/client-utils";

import { SearchBarDropdown } from "../../components/searchbar-dropdown";
import {
  useClientSearchActions,
  useClientSearchLastSearched,
  useClientSearchSelectedClient,
  useClientSearchValue,
  type SearchedClient,
} from "../../header/use-client-search-input-store";

export const SearchBarCalendar = ({ inputClassName }: { inputClassName?: string }) => {
  const locationIds = useStudioSelectedLocationIds();

  const search = useClientSearchValue();
  const lastSearchedUsers = useClientSearchLastSearched();
  const selectedClient = useClientSearchSelectedClient();
  const { setSearch, selectClient } = useClientSearchActions();

  const debouncedSearch = useDebounce(search, 300);
  const isQueryEnabled = debouncedSearch.length > 0;

  const searchResult = trpc.clients.search.checkIn.useInfiniteQuery(
    { q: debouncedSearch, locationIds, limit: 5 },
    { enabled: isQueryEnabled, getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <div className="flex justify-end">
      <SearchBarDropdown<SearchedClient>
        inputClassName={inputClassName}
        searchText={search}
        onSearchTextChange={setSearch}
        pages={searchResult.data?.pages ?? []}
        lastSearched={lastSearchedUsers}
        isInitialLoading={searchResult.isPending}
        isLoadingMore={searchResult.isFetchingNextPage}
        hasMore={searchResult.hasNextPage}
        loadMore={searchResult.fetchNextPage}
        hasError={searchResult.isError}
        errorText={searchResult.error?.message ?? null}
        selectedItem={selectedClient}
        onSelectItem={(item) => selectClient(item, true)}
        getItemKey={(item) => item.id}
        renderItem={(item) => (
          <>
            <UserAvatar size={8} name={item.fullName} url={item.imageUrl} />
            <span>{item.fullName}</span>
          </>
        )}
        renderSelectedItem={(item) => <span>{item.fullName}</span>}
        hideBorder={false}
        collapsible={true}
        resizeForBadge={false}
      />
    </div>
  );
};
