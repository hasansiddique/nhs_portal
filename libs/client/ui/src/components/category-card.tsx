import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  item: {
    id?: string;
    image: string;
    title: string;
  };
}
export const CategoryCard = ({...props}: CardProps) => {

  return (
    <div className="swiper-container p-0 show-shadow carousel auctions">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <Link to={`/props?category=${props.item.id}`}>
            <div
              className="slider-item mb-[40px]"
            >
              <div className={`card-media aspect-square rounded-xl overflow-hidden`}>
                <img
                  alt={props.item.title}
                  src={props.item.image}
                  width={270}
                  height={287}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="px-4 mt-5 text-[18px] font-semibold leading-[22px] text-[#C5B6B3] text-center whitespace-nowrap truncate">
                {props.item.title}
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
