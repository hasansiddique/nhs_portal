import React from 'react';
import { Link } from 'react-router-dom';

export interface ActorProps {
  id: string;
  name: string;
  title: string;
  imgleft: string;
  wishlist: number;
  imgright1: string;
  imgright2: string;
  imgright3: string;
  totalLikes: number;
  totalImages?: number;
  totalProducts?: number;
  totalProductLikes?: number;
}

export const ActorCard = ({
  item,
  redirectLink,
}: {
  item: ActorProps;
  redirectLink: string;
}) => {
  return (
    <div className="sc-card-collection style-2 sm:!mb-[30px]">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div>
            <h4
              title={item.title}
              className="max-w-[300px] font-bold text-[20px] leading-[28px] text-[#EDE8E7] mb-2 capitalize text-truncate"
            >
              {item.title}
            </h4>

            <p className="text-[18px] text-[#C5B6B3]">{item.name}</p>
          </div>
        </div>
        <div className="wishlist-button public heart bg-[#222222] mt-2">
          <span className="font-bold text-[14px]">{item.totalProductLikes || item.totalLikes || 0}</span>
        </div>
      </div>

      {item.totalImages === 1 ? (
        <div className="media-images-collection">
          <div className="box-left m-0 !w-full">
            <img src={item.imgright1} alt="Axies" />
          </div>
        </div>
      ) : item.totalImages === 2 ? (
        <div className="media-images-collection">
          <div className="box-left">
            <img src={item.imgright1} alt="Axies" />
          </div>

          <div className="box-left m-0">
            <img src={item.imgright2} alt="Axies" />
          </div>
        </div>
      ) : item.totalImages === 3 ? (
        <div className="media-images-collection">
          <div className="box-left">
            <img src={item.imgright1} alt="Axies" />
          </div>

          <div className="box-right">
            <div className="mb-[10px] w-full">
              <img
                src={item.imgright2}
                alt="Axies"
                className="w-full h-[100px]"
              />
            </div>
            <div className="bottom-img">
              <img src={item.imgright3} alt="Axies" />
            </div>
          </div>
        </div>
      ) : (
        <div className="media-images-collection">
          <div className="box-left">
            <img src={item.imgleft} alt="Axies" />
          </div>

          <div className="box-right">
            <div className="top-img">
              <img src={item.imgright1} alt="Axies" />
              <img src={item.imgright2} alt="Axies" />
            </div>
            <div className="bottom-img">
              <img src={item.imgright3} alt="Axies" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
