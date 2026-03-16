import React from 'react';
import { toNumber } from 'lodash';

import { SvgStarIcon, SvgWhiteStarIcon } from '@your-props/client/icons';
import { timeAgo } from '@your-props/client/utils';
import profileImage from '../theme/assets/images/avatar/user-img.png';

export const renderStars = (rating: number) => {
  const totalStars = 5;
  return Array.from({ length: totalStars }, (_, index) => {
    return index < rating ? (
      <SvgStarIcon key={index} width={16} height={16} className="mr-[10px]" />
    ) : (
      <SvgWhiteStarIcon
        key={index}
        width={16}
        height={16}
        className="mr-[10px]"
      />
    );
  });
};

export const UserRatingReview = ({ review }: { review: any }) => {
  return (
    <div className="mt-[28px] bg-[#292929] rounded-[10px]">
      <div className="p-[40px] flex flex-row">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="w-[42px] h-[42px] rounded-[10px] items-center justify-center">
              <img
                alt="user"
                className="rounded-3xl default_image"
                src={review?.avatar || profileImage}
              />
            </div>

            <div className="justify-between flex flex-col ml-[15px]">
              <p className="leading-[130%] text-[16px] capitalize">
                {review?.displayName}
              </p>
              <p className="text-[12px] leading-[20px] text-[#C5B6B3] font-semibold">
                {timeAgo(review?.createdAt)}
              </p>
            </div>
          </div>

          <div className="py-[16px] flex">
            {renderStars(toNumber(review?.rating) || 0)}
          </div>
        </div>

        <div
          className="ml-[60px] mr-[30px]"
          style={{ borderLeft: '1px solid #C5B6B3' }}
        />

        <div>
          <p className="text-[16px] leading-[18px] mb-[26px]">
            {review?.review}
          </p>
        </div>
      </div>
    </div>
  );
};
