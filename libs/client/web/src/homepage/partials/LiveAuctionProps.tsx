import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { PropCard } from '@your-props/client/ui';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

import img1 from '../../theme/assets/images/box-item/card-item-3.jpg';
import imga1 from '../../theme/assets/images/avatar/avt-1.jpg';
import imgCollection1 from '../../theme/assets/images/avatar/avt-18.jpg';
import img2 from '../../theme/assets/images/box-item/card-item-4.jpg';
import imga2 from '../../theme/assets/images/avatar/avt-2.jpg';
import imgCollection2 from '../../theme/assets/images/avatar/avt-16.jpg';
import img3 from '../../theme/assets/images/box-item/card-item-2.jpg';
import imga3 from '../../theme/assets/images/avatar/avt-4.jpg';
import imgCollection3 from '../../theme/assets/images/avatar/avt-17.jpg';
import img4 from '../../theme/assets/images/box-item/image-box-21.jpg';
import imga4 from '../../theme/assets/images/avatar/avt-14.jpg';
import { toNumber } from 'lodash';

const liveAuctionProps = [
  {
    img: img1,
    title: 'Hamlet Contemplates Contemplates ',
    subTitle: 'Hamlet Contemplates Contemplates ',
    tags: 'bsc',
    imgAuthor: imga1,
    nameAuthor: 'SalvadorDali',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Colorful Abstract',
  },
  {
    img: img2,
    title: 'Triumphant Awakening Contemplates ',
    subTitle: 'Hamlet Contemplates Contemplates ',
    tags: 'bsc',
    imgAuthor: imga2,
    nameAuthor: 'Trista Francis',
    price: 400,
    priceChange: '$12.246',
    wishlist: '220',
    showcaseOnly: true,
    imgCollection: imgCollection2,
    nameCollection: 'Colorful Abstract',
  },
  {
    img: img3,
    title: 'Living Vase 01 by Lanza Contemplates',
    subTitle: 'Hamlet Contemplates Contemplates ',
    tags: 'bsc',
    imgAuthor: imga3,
    nameAuthor: 'Freddie Carpenter',
    price: 400,
    priceChange: '$12.246',
    wishlist: '90',
    imgCollection: imgCollection3,
    nameCollection: 'Colorful Abstract',
  },
  {
    img: img4,
    title: "Flame Dress' by Balmain Contemplates ",
    subTitle: 'Hamlet Contemplates Contemplates ',
    tags: 'bsc',
    imgAuthor: imga4,
    nameAuthor: 'Tyler Covington',
    price: 400,
    priceChange: '$12.246',
    wishlist: '145',
    imgCollection: imgCollection1,
    nameCollection: 'Colorful Abstract',
  },
  {
    img: img1,
    title: 'Hamlet Contemplates Contemplates ',
    subTitle: 'Hamlet Contemplates Contemplates ',
    tags: 'bsc',
    imgAuthor: imga1,
    nameAuthor: 'SalvadorDali',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection2,
    nameCollection: 'Colorful Abstract',
  },
  {
    img: img2,
    title: 'Triumphant Awakening Contemplates ',
    subTitle: 'Hamlet Contemplates Contemplates ',
    tags: 'bsc',
    imgAuthor: imga2,
    nameAuthor: 'Trista Francis',
    price: 400,
    priceChange: '$12.246',
    wishlist: '220',
    imgCollection: imgCollection3,
    nameCollection: 'Colorful Abstract',
  },
];

export const LiveAuctionProps = () => {
  return (
    <section className="tf-section live-auctions featured-props-section">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions flex-col sm:flex-row items-baseline sm:items-center">
              <h2 className="tf-title pb-20">Live Auctions Ending Soon</h2>
              <Link
                to="/explore-03"
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
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {liveAuctionProps.slice(0, 7).map((item: any, index: number) => (
                <SwiperSlide key={index}>
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
