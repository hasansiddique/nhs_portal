import React from 'react';
import { toNumber } from 'lodash';

import { NoContentPage, ProgressBar } from '@your-props/client/ui';

import { renderStars, UserRatingReview } from './RatingReview';

export const UserRatings = ({ reviewsData }: { reviewsData: any }) => {
  return (
    <div>
      <p className="text-[28px] font-bold pb-[31px]">Ratings</p>

      <div className="bg-[#393939] rounded-[8px] px-[40px] py-[36px]">
        <div className="flex flex-col sm:flex-row md:justify-between">
          <div className="justify-start w-full md:w-1/2">
            <p className="text-[40px] font-bold">
              {reviewsData?.userDetails?.averageRating}
            </p>

            <div className="py-[16px] flex">
              {renderStars(
                toNumber(reviewsData?.userDetails?.averageRating) || 0
              )}
            </div>

            <p className="text-[#C5B6B3] text-[12px] font-medium leading-normal">
              {`(${reviewsData?.reviews?.length || 0} Reviews)`}
            </p>
          </div>

          <div className="justify-end w-full md:w-1/2 mt-6 sm:mt-0">
            <div className="flex">
              <div className="w-[30px] text-right text-[10px] font-medium leading-normal whitespace-nowrap">
                5 stars
              </div>

              <div className="px-[9px] w-full items-center pt-[4px]">
                <ProgressBar progress={68} />
              </div>

              <div className="w-[20px] text-left text-[10px] font-medium leading-normal whitespace-nowrap">
                488
              </div>
            </div>

            <div className="flex">
              <div className="w-[30px] text-right text-[10px] font-medium leading-normal whitespace-nowrap">
                4 stars
              </div>

              <div className="px-[9px] w-full items-center pt-[4px]">
                <ProgressBar progress={30} />
              </div>

              <div className="w-[20px] text-left text-[10px] font-medium leading-normal whitespace-nowrap">
                74
              </div>
            </div>

            <div className="flex">
              <div className="w-[30px] text-right text-[10px] font-medium leading-normal whitespace-nowrap">
                3 stars
              </div>

              <div className="px-[9px] w-full items-center pt-[4px]">
                <ProgressBar progress={14} />
              </div>

              <div className="w-[20px] text-left text-[10px] font-medium leading-normal whitespace-nowrap">
                14
              </div>
            </div>

            <div className="flex">
              <div className="w-[30px] text-right text-[10px] font-medium leading-normal whitespace-nowrap">
                2 stars
              </div>

              <div className="px-[9px] w-full items-center pt-[4px]">
                <ProgressBar progress={0} />
              </div>

              <p className="w-[20px] text-left text-[10px] font-medium leading-normal whitespace-nowrap">
                0
              </p>
            </div>

            <div className="flex">
              <div className="w-[35px] text-right text-[10px] font-medium leading-normal whitespace-nowrap">
                1 star
              </div>

              <div className="px-[9px] w-full items-center pt-[4px]">
                <ProgressBar progress={0} />
              </div>

              <div className="w-[20px] text-left text-[10px] font-medium leading-normal whitespace-nowrap">
                0
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[65px] mb-8 flex justify-between items-center">
        <p className="text-[28px] font-bold leading-[20px]">Buyer Reviews</p>
      </div>

      <div>
        {/* overflow-y-auto */}
        {reviewsData?.reviews?.length > 0 ? (
          reviewsData?.reviews?.map((review: any) => {
            return <UserRatingReview review={review} />;
          })
        ) : (
          <NoContentPage isSpacing={false} subText="No reviews found" />
        )}
      </div>
    </div>
  );
};
