import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { CategoryCard } from '@your-props/client/ui';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

import img1 from '../../theme/assets/images/avatar/category_default.jpg';

interface categoryItem {
  name: string;
  image: string;
}

export const AllCategoryProps = ({
  categories,
}: {
  categories: categoryItem[];
}) => {
  return (
    <section className="tf-section live-auctions featured-props-section bg-[#393939]">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions">
              <h2 className="tf-title pb-20">All Categories</h2>
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
                  slidesPerView: 3,
                },
                991: {
                  slidesPerView: 4,
                  pagination: {
                    dynamicBullets: true,
                    dynamicMainBullets: 4,
                  },
                },
                1100: {
                  slidesPerView: 4,
                  pagination: {
                    dynamicBullets: true,
                    dynamicMainBullets: 4,
                  },
                },
                1300: {
                  slidesPerView: 5,
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
              // scrollbar={{ draggable: true }}
            >
              {categories?.map((item: any, index: number) => (
                <SwiperSlide className="py-[20px]" key={index}>
                  <CategoryCard
                    item={{
                      id: item.id,
                      title: item.name,
                      image: item.image || img1,
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
