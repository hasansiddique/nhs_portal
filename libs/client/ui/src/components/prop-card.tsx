import React from 'react';
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import { SvgCartFilled, SvgTimerIcon } from '@your-props/client/icons';
import {toZonedTime} from "date-fns-tz";

interface CardProps {
  item: {
    id?: string;
    slug?: string;
    image: string;
    title: string;
    movieName: string;
    price?: string;
    bidsCount?: string;
    currentBid?: string;
    subTitle?: string;
    listingType?: string;
    productLikes?: string;
    auctionStartTime?: string;
    auctionEndTime?: string;
    userId?: string;
  };
  placeBid?: {
    show: boolean;
    buttonText: string;
  };
  wishlist?: {
    show: boolean;
    count: number;
  };
  featureTag?: {
    text: string;
    show: boolean;
  };
  children?: React.ReactNode;
}

export const getItemPriceString = (price: any) => {
  let priceNum = parseInt(String(price).replace(/,/g, ''));

  if (isNaN(priceNum) || priceNum === 0) return '0'; // Handle invalid inputs & zero

  const formatNumber = (num: number) => {
    const rounded = num.toFixed(1); // Keeps one decimal place if needed
    return rounded.endsWith('.0') ? rounded.slice(0, -2) : rounded; // Remove ".0" if whole
  };

  // Handle values less than 1 (scale up to thousands)
  if (priceNum < 1) {
    priceNum = priceNum * 100_000; // Convert 0.05 → 10K, 0.005 → 1K
    return formatNumber(priceNum) + 'K';
  }

  return priceNum >= 1_000_000_000_000
    ? formatNumber(priceNum / 1_000_000_000_000) + 'T'
    : priceNum >= 1_000_000_000
      ? formatNumber(priceNum / 1_000_000_000) + 'B'
      : priceNum >= 1_000_000
        ? formatNumber(priceNum / 1_000_000) + 'M'
        : priceNum >= 10_000
          ? formatNumber(priceNum / 1_000) + 'K'
          : formatNumber(priceNum);
};

const getAuctionTimings = (item: any) => {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!item.auctionStartTime || !item.auctionEndTime) {
    return { started: false, ended: false, timer: null };
  }

  // Convert auction times from UTC to local time
  const startTimeUTC = new Date(item.auctionStartTime + 'Z');
  const endTimeUTC = new Date(item.auctionEndTime + 'Z');
  const nowUTC = new Date();

  const startTimeLocal = toZonedTime(startTimeUTC, localTimeZone);
  const endTimeLocal = toZonedTime(endTimeUTC, localTimeZone);
  const nowLocal = toZonedTime(nowUTC, localTimeZone);

  return {
    started: startTimeLocal <= nowLocal,
    ended: endTimeLocal <= nowLocal,
    timer: endTimeLocal,
  };
};

const getUserId = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  return currentUser?.id as string;
};

export const PropListCard = ({ ...props }: CardProps) => {
  const auction = getAuctionTimings(props.item);
  const LinkWrapper = props.item.slug ? Link : 'span';

  return (
    <div className="sc-card-activity style1 p-[20px] sm:p-[24px] flex-col items-start gap-4 sm:items-center sm:flex-row sm-w sm:min-w-[360px]">
      <div className="content sm-w">
        <div className="media">
          <img src={props.item.image} alt="Axies" />
        </div>
        <div className="flex flex-col gap-4 sm-w">
          <div className="">
            <h5
              title={props.item.subTitle}
              className="text-[#EDE8E7] text-truncate max-w"
            >
              {props.item.subTitle}
            </h5>

            <h5
              title={props.item.title}
              className="font-[400] mt-[5px] text-[#C5B6B3] leading-[22px] text-truncate max-w sub"
            >
              {props.item.title}
            </h5>
          </div>

          {props.wishlist?.show && (
            <div className="wishlist-button heart my-[5px] text-[14px] font-[500]">
              <span className="number-like text-[14px]">
                {props.wishlist?.count || 0}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className={`card-bottom w-full sm:w-auto flex ${
          props.item.listingType === 'bidding' ||
          props.item.listingType === 'sell_on_site'
            ? 'justify-between'
            : 'justify-end'
        } items-center sm:items-end flex-row sm:!flex-col gap-6`}
      >
        {(props.item.listingType === 'bidding' ||
          props.item.listingType === 'sell_on_site') && (
          <h5 className="w-full mt-0 text-[26px] text-right">
            <p className="text-[#C5B6B3] text-[14px] leading-[20px]">
              {props.item.listingType === 'bidding'
                ? auction.ended
                  ? 'Winning Bid'
                  : props.item?.bidsCount === '0'
                  ? 'Starting Bid'
                  : `Highest of (${props.item.bidsCount} bids)`
                : 'Price'}
            </p>
            {auction.ended && props.item.bidsCount === '0'
              ? '-'
              : `$${getItemPriceString(props.item.price)}`}
          </h5>
        )}
        <LinkWrapper to={`/${props.item.slug}`}>
          <div className="flex">
            {props.item.userId === getUserId() ? (
              <button className="ml-0 w-[160px] py-[10px] h-[50px] px-[20px] text-[18px] font-[500] rounded-[10px] border-none focus:text-white hover:opacity-90 hover:text-white bg-[#222222]">
                <span className="whitespace-nowrap text-[18px] font-[500]">
                  View Details
                </span>
              </button>
            ) : (
              <>
                <button
                  className={`ml-0 py-[10px] w-[160px] h-[50px] px-[20px] text-[18px] font-[500] rounded-[10px] border-none focus:text-white hover:opacity-90 hover:text-white  ${
                    props.item.listingType === 'showcase_only' || auction.ended
                      ? 'bg-[#222222] '
                      : ''
                  } ${
                    props.item.listingType === 'sell_on_site'
                      ? 'rounded-r-none !w-auto'
                      : ''
                  }`}
                >
                  <span className="whitespace-nowrap text-[18px] font-[500]">
                    {props.item.listingType === 'showcase_only'
                      ? 'Showcase Only'
                      : props.item.listingType === 'bidding' && !auction.ended
                      ? 'Place Bid'
                      : props.item.listingType === 'sell_on_site'
                      ? 'Buy Now'
                      : props.item.listingType === 'accepting_offer'
                      ? 'Make Offer'
                      : 'View Details'}
                  </span>
                </button>
                {props.item.listingType === 'sell_on_site' && (
                  <button
                    className={`h-[50px] ml-0 py-[10px] px-[12px] rounded-[10px] rounded-l-none bg-[#C75A33] border-[#C75A33] hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                  >
                    <SvgCartFilled />
                  </button>
                )}
              </>
            )}
          </div>
        </LinkWrapper>
      </div>
    </div>
  );
};

export const PropCard = ({ ...props }: CardProps) => {
  const auction = getAuctionTimings(props.item);
  const LinkWrapper = props.item.slug ? Link : 'span';

  return (
    <div className="swiper-container p-0 show-shadow carousel auctions">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <LinkWrapper to={`/${props.item.slug}`} className="hover:text-white">
            <div className="slider-item">
              <div
                className={`sc-card-product ${
                  props.featureTag?.show && props.featureTag?.text
                    ? props.featureTag?.text
                    : ''
                } menu_card`}
              >
                <div className={`card-media aspect-square`}>
                  <img
                    alt={props.item.title}
                    src={props.item.image}
                    width={270}
                    height={287}
                    className="object-cover w-full h-full"
                  />

                  <div className="absolute right-[11px] top-[13px]">
                    <div className=" flex items-center gap-2">
                      {props.featureTag?.show && (
                        <div className="coming-soon-card rounded-[10px]">
                          {props.featureTag?.text || 'screen-matched'}
                        </div>
                      )}
                      {props.wishlist?.show && (
                        <span className="wishlist-button-card heart bg-[#676767]">
                          <span className="number-like">
                            {props.wishlist?.count || 0}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {props.item.listingType == 'bidding' && (
                    <div className="featured-countdown capitalize">
                      {auction.started ? ( auction.ended ? (
                          'Auction ended'
                        ) : (
                          <>
                            <SvgTimerIcon/>
                            <div className="ml-2 text-white">
                              <Countdown date={auction.timer || undefined}/>
                            </div>
                          </>
                        )
                      ) : (
                        'Starting soon'
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-[16px] flex flex-col items-start">
                  <h4 className="w-100 text-[#EDE8E7] text-truncate capitalize text-[18px] leading-[22px]">
                    {props.item.movieName}
                  </h4>

                  <h5 className="w-100 font-[400] text-truncate mt-1 leading-[22px] text-[#C5B6B3] text-truncate">
                    {props.item.title}
                  </h5>
                </div>
                <div className="card-bottom !flex w-full">
                  <div className="flex">
                    {props.item.userId === getUserId() ? (
                      <button className="ml-0 py-[10px] h-[50px] px-[20px] text-[18px] font-[500] rounded-[10px] border-none focus:text-white hover:opacity-90 hover:text-white bg-[#222222]">
                        <span className="whitespace-nowrap text-[18px] font-[500]">
                          View Details
                        </span>
                      </button>
                    ) : (
                      <>
                        <button
                          className={`ml-0 py-[10px] h-[50px] px-[20px] text-[18px] font-[500] rounded-[10px] border-none focus:text-white hover:opacity-90 hover:text-white  ${
                            props.item.listingType === 'showcase_only' ||
                            auction.ended
                              ? 'bg-[#222222]'
                              : ''
                          } ${
                            props.item.listingType === 'sell_on_site'
                              ? 'rounded-r-none'
                              : ''
                          }`}
                        >
                          <span className="whitespace-nowrap text-[18px] font-[500]">
                            {props.item.listingType === 'showcase_only'
                              ? 'Showcase Only'
                              : props.item.listingType === 'bidding' &&
                                !auction.ended
                              ? 'Place Bid'
                              : props.item.listingType === 'sell_on_site'
                              ? 'Buy Now'
                              : props.item.listingType === 'accepting_offer'
                              ? 'Make Offer'
                              : 'View Details'}
                          </span>
                        </button>
                        {props.item.listingType === 'sell_on_site' && (
                          <button
                            className={`h-[50px] ml-0 py-[10px] px-[12px] rounded-[10px] rounded-l-none bg-[#C75A33] border-[#C75A33] hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none`}
                          >
                            <SvgCartFilled />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {(props.item.listingType === 'bidding' ||
                    props.item.listingType === 'sell_on_site') && (
                    <h5 className="mt-0 text-[26px] text-white text-right">
                      <p className="text-[#C5B6B3] text-[14px] leading-[20px]">
                        {props.item.listingType === 'bidding'
                          ? auction.ended
                            ? 'Winning Bid'
                            : props.item?.bidsCount === '0' ||
                              props.item?.bidsCount === undefined
                            ? 'Starting Bid'
                            : 'Highest Bid'
                          : 'Price'}
                      </p>
                      {auction.ended && props.item.bidsCount === '0'
                        ? '-'
                        : `$${getItemPriceString(props.item.price)}`}
                    </h5>
                  )}
                </div>
              </div>
            </div>
          </LinkWrapper>
        </div>
      </div>
    </div>
  );
};
