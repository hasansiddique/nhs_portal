import React from 'react';
import {
  CardsSkeleton,
  InfiniteScroll,
  NoContentPage,
  PropCard,
  PropListCard,
} from '@your-props/client/ui';
import { CardProps } from '../../homepage/hompage-props';
import img1 from '../../theme/assets/images/box-item/image-box-47.jpg';

interface PageData {
  page: number;
  totalPages: number;
  totalPage?: number; // Adding optional totalPage to match both versions
}

interface ItemContentProps {
  propsList: CardProps[];
  showFilters?: boolean;
  nextPageData: PageData;
  fetchMoreProps: () => void;
  loadingMoreProps: boolean;
  loadingFilteredProps: boolean;
  isGridView: boolean;
}

const ItemContent: React.FC<ItemContentProps> = ({
  propsList,
  showFilters,
  nextPageData,
  fetchMoreProps,
  loadingMoreProps,
  loadingFilteredProps,
  isGridView,
}) => {
  const getColumnClassName = (isGrid: boolean) =>
    isGrid
      ? showFilters
        ? 'col-xl-4 col-md-6'
        : 'col-xl-3 col-lg-4 col-md-6'
      : 'col-12';

  const renderInfiniteScroll = (isGrid: boolean) => (
    <InfiniteScroll
      isTable={false}
      hasNextPage={nextPageData?.page !== nextPageData?.totalPages}
      isFetchingNextPage={loadingMoreProps}
      isLoading={loadingFilteredProps}
      fetchNextPage={fetchMoreProps}
      data={Array.from(new Set(propsList.map((item) => item.id))).map((id) =>
        propsList.find((item) => item.id === id)
      )}
      itemRenderer={(item, index) => {


        return isGrid ? (
          <div
            key={index}
            className={`fl-item ${getColumnClassName(isGrid)}`}>
            <PropCard
              featureTag={{
                text: 'screen-matched',
                show: item?.isOriginal === '1',
              }}
              item={{
                ...item,
                image: item.imagePath || img1,
                subTitle: item?.movieName,
              }}
              wishlist={{ show: true, count: item?.productLikes }}
            />
          </div>
        ) : (
          <div
            key={index}
            className="col-12">
            <PropListCard
              featureTag={{
                text: 'screen-matched',
                show: item?.isOriginal === '1',
              }}
              item={{
                ...item,
                image: item.imagePath || img1,
                subTitle: item?.movieName,
              }}
              wishlist={{ show: true, count: item?.productLikes }}
            />
          </div>
        );
      }}
    />
  );

  if (loadingFilteredProps) {
    return (
      <div className="pt-[40px]">
        <CardsSkeleton count={showFilters ? 3 : 4} isGridView={isGridView} showFilters={showFilters} />
      </div>
    );
  }

  if (propsList?.length === 0 && !loadingFilteredProps) {
    return (
      <div className="pt-[40px] mx-[15px]">
        <NoContentPage subText="No props found" />
      </div>
    );
  }

  return propsList?.length > 0 && renderInfiniteScroll(isGridView);
};

export default ItemContent;
