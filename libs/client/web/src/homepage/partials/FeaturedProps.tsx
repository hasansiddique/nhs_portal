import React from 'react';
import { toNumber } from 'lodash';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { PropCard } from '@your-props/client/ui';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

import { CardProps } from '../hompage-props';

import img1 from '../../theme/assets/images/box-item/card-item-3.jpg';

export const FeaturedProps = ({
  featuredProducts,
}: {
  featuredProducts: CardProps[];
}) => {
  return (
    <section className="tf-section live-auctions featured-props-section">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions flex-col sm:flex-row items-baseline sm:items-center">
              <h2 className="tf-title pb-20">Featured Props</h2>
              <Link
                to="/props"
                className="exp style2 pt-6 sm:pt-0 self-end sm:self-auto"
              >
                EXPLORE MORE
              </Link>
            </div>
          </div>
          <div className="col-md-12">
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={30}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                767: {
                  slidesPerView: 2,
                },
                991: {
                  slidesPerView: 3,
                  pagination: {
                    dynamicBullets: true,
                    dynamicMainBullets: 4,
                  },
                },
                1100: {
                  slidesPerView: 3,
                  pagination: {
                    dynamicBullets: true,
                    dynamicMainBullets: 4,
                  },
                },
                1300: {
                  slidesPerView: 4,
                  pagination: {
                    dynamicBullets: true,
                    dynamicMainBullets: 3,
                  },
                },
              }}
              navigation={true}
              pagination={{
                clickable: true,
              }}
            >
              {featuredProducts?.map((item: CardProps, index: number) => (
                <SwiperSlide className="py-[20px]" key={index}>
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
                    wishlist={{
                      show: true,
                      count: toNumber(item?.productLikes),
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};
