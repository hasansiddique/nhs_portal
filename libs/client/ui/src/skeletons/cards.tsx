import React from 'react';

const getColumnClassName = (isGrid: boolean, showFilters: boolean) =>
  isGrid
    ? showFilters
      ? 'col-xl-4 col-md-6'
      : 'col-xl-3 col-lg-4 col-md-6'
    : 'col-12';

export const CardsSkeleton = ({ count = 3, isGridView = true, showFilters = false }) => {
  return (
    <>
      <div className="flex flex-wrap">
        {Array.from({length: count}).map((_, index) => (
          <div
            key={index}
            className={`fl-item ${getColumnClassName(isGridView, showFilters)}`}
            style={{opacity: 1 - index * 0.25}}
          >
            <div
              className={`sc-card-product menu_card animate-pulse ${
                !isGridView &&
                'flex gap-12 justify-between items-center rounded-[12px] p-[24px]'
              }`}
              style={{animationDelay: index * 0.5 + 's'}}
            >
              <div className={`card-media ${!isGridView && 'mb-0'}`}>
                <div
                  className={`${
                    isGridView ? 'w-full' : 'w-[112px]'
                  } aspect-square bg-gray-500 rounded`}
                ></div>
              </div>
              <div
                className={`${
                  isGridView && 'mb-[16px]'
                } flex flex-col items-start flex-grow`}
              >
                <div className="h-8 w-3/4 bg-gray-500 rounded-xl mt-2"></div>
                <div className="mt-[5px] h-6 w-1/2 bg-gray-500 rounded-lg"></div>
              </div>
              <div className={`card-bottom flex ${!isGridView && 'mt-0'}`}>
                <div className="py-[12px] px-[20px] h-[48px] w-[160px] bg-gray-500 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
