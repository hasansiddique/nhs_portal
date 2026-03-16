import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Pagination } from 'swiper/modules';

import { ActorCard } from '@your-props/client/ui';

import { FeatureCardProps } from '../hompage-props';

import img1 from '../../theme/assets/images/box-item/card-item-3.jpg';

export const FeaturedCollection = ({
  featuredCollections,
}: {
  featuredCollections: FeatureCardProps[];
}) => {
  return (
    <section className="tf-section live-auctions featured-props-section ">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions flex-col sm:flex-row items-baseline sm:items-center">
              <h2 className="tf-title pb-22 text-left">Featured Collection</h2>
              <Link
                to={`/props?collections=${encodeURIComponent(
                  featuredCollections.map((c) => c.id).join(',')
                )}`}
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
              {featuredCollections?.map(
                (item: FeatureCardProps, index: number) => (
                  <SwiperSlide className="py-[20px]" key={index}>
                    <Link
                      key={item.id}
                      to={`/props?collections=${item.id}`}
                      className="movie-card fl-item col-xl-4 col-lg-6 col-md-6 col-sm-12"
                    >
                      <ActorCard
                        redirectLink=""
                        item={{
                          ...item,
                          title: item.name,
                          wishlist: item.totalLikes,
                          totalLikes: item.totalLikes,
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
