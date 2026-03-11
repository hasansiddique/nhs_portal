import React from 'react';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAuthDialogStore, PaymentCheck } from '@your-props/client/utils';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { SignIn } from '../../auth/SignIn';
import noImg from '../../theme/assets/images/box-item/card-item-3.jpg';
import { CardProps } from '../hompage-props';

export const TopSlider = ({
  newestProducts,
  featuredProducts,
  todayPick,
  trendingPropsCostumes,
}: {
  newestProducts: CardProps[];
  featuredProducts: CardProps[];
  todayPick: CardProps[];
  trendingPropsCostumes: CardProps[];
}) => {
  const title = 'Immerse Yourself in the extraordinary world of cinema';
  const description = 'Own Authentic Props from Iconic Movies & TV Series';

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  const { toggleDialogVisibility } = useAuthDialogStore();
  return (
    <section className="flat-title-page home5 slider-height">
      <div className="overlay"></div>
      <div className="themesflat-container slider-height">
        <div className="wrap-heading flat-slider d-flex align-items-center slider-height">
          <div className="content sm:mr-20">
            <h2 className="heading xl:text-[56px] lg:text-[50px] leading-[68px] whitespace-break-spaces w-[80%]">
              {title}
            </h2>
            <p className="sub-heading lg:text-[20px] md:text-[18px] mg-t-7 mg-bt-39">
              {description}
            </p>

            <div className="flex-sm pt-5">
              <Link
                to="/props?sorting=1"
                id="load-more"
                className="sc-button fl-button pri-3 w-[150px] h-[56px] px-[25px] py-[14px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B]"
              >
                <span>Explore Props</span>
              </Link>

              {isLoggedIn ? (
                <PaymentCheck addShowcaseAllowed>
                  <button className="sc-button loadmore fl-button pri-3 w-[150px] h-[56px] rounded-[10px] ml-[20px] whitespace-nowrap">
                    <span>Sell Props</span>
                  </button>
                </PaymentCheck>
              ) : (
                <button
                  onClick={() =>
                    toggleDialogVisibility(
                      true,
                      <SignIn redirectUrl="/dashboard/add-item" />
                    )
                  }
                  className="sc-button loadmore fl-button pri-3 w-[150px] h-[56px] rounded-[10px] ml-[20px] whitespace-nowrap"
                >
                  <span>Sell Props</span>
                </button>
              )}
            </div>
          </div>

          <Swiper
            modules={[Autoplay]}
            direction={'vertical'}
            spaceBetween={10}
            slidesPerView={4}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={2500}
          >
            {newestProducts?.map((item: CardProps, index: number) => (
              <SwiperSlide key={index}>
                <Link to={`/${item.slug}`}>
                  <img
                    src={item.imagePath || noImg}
                    alt={item.title}
                    className="rounded-[14px] xl:w-auto lg:w-[300px] w-[280px] object-cover"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            modules={[Autoplay]}
            direction={'vertical'}
            spaceBetween={10}
            slidesPerView={4}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={2500}
          >
            {todayPick?.map((item: CardProps, index: number) => (
              <SwiperSlide key={index}>
                <Link to={`/${item.slug}`}>
                  <img
                    src={item.imagePath || noImg}
                    alt={item.title}
                    className="rounded-[14px] xl:w-auto lg:w-[300px] w-[280px] object-cover"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            modules={[Autoplay]}
            direction={'vertical'}
            spaceBetween={10}
            slidesPerView={4}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={2500}
          >
            {trendingPropsCostumes?.map((item: CardProps, index: number) => (
              <SwiperSlide key={index}>
                <Link to={`/${item.slug}`}>
                  <img
                    src={item.imagePath || noImg}
                    alt={item.title}
                    className="rounded-[14px] xl:w-auto lg:w-[300px] w-[280px] object-cover"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            modules={[Autoplay]}
            direction={'vertical'}
            spaceBetween={10}
            slidesPerView={3}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={2500}
            className="end"
          >
            {featuredProducts?.map((item: CardProps, index: number) => (
              <SwiperSlide key={index}>
                <Link to={`/${item.slug}`}>
                  <img
                    src={item.imagePath || noImg}
                    alt={item.title}
                    className="rounded-[14px] xl:w-auto lg:w-[300px] w-[280px] object-cover"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
