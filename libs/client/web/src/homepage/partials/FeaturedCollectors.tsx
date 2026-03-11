import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Pagination } from 'swiper/modules';

import { ActorCard } from '@your-props/client/ui';

import { FeatureCardProps } from '../hompage-props';

import img1 from '../../theme/assets/images/box-item/card-item-3.jpg';
import { toNumber } from 'lodash';

export const FeaturedCollectors = ({
  featuredCollectors,
}: {
  featuredCollectors: FeatureCardProps[];
}) => {
  return (
    <section className="tf-section live-auctions featured-props-section">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions flex-col sm:flex-row items-baseline sm:items-center">
              <h2 className="tf-title pb-22 text-left">Featured Collectors</h2>
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
                    dynamicMainBullets: 3,
                  },
                },
                1100: {
                  slidesPerView: 3,
                  pagination: {
                    dynamicBullets: true,
                    dynamicMainBullets: 3,
                  },
                },
                1300: {
                  slidesPerView: 3,
                  pagination: {
                    dynamicBullets: true,
                    dynamicMainBullets: 3,
                  },
                },
              }}
              navigation={true}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {featuredCollectors?.map(
                (item: FeatureCardProps, index: number) => (
                  <SwiperSlide className="py-[20px]" key={index}>
                    <Link
                      key={item.id}
                      to={`/user/${item.id}/details`}
                      className="movie-card fl-item col-xl-4 col-lg-6 col-md-6 col-sm-12"
                    >
                      <ActorCard
                        redirectLink=""
                        item={{
                          ...item,
                          title: item.username,
                          wishlist: item.totalLikes,
                          totalLikes: item.totalLikes,
                          totalProducts: toNumber(item.totalProducts),
                          totalImages: item.images?.length ?? null,
                          imgleft: item.images?.[3] || img1,
                          imgright1: item.images?.[0] || img1,
                          imgright2: item.images?.[1] || img1,
                          imgright3: item.images?.[2] || img1,
                          name: `${item.totalProducts} Prop${
                            item.totalProducts > 1 ? 's' : ''
                          }`,
                        }}
                      />
                    </Link>
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};
