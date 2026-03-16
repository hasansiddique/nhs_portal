import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { isEmpty, toNumber } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import {
  Breadcrumbs,
  FullPageSpinner,
  getItemPriceString,
  PropCartButton,
} from '@your-props/client/ui';
import {
  HandShakeIcon,
  SvgFollow,
  SvgShare,
  SvgStarIconSm,
} from '@your-props/client/icons';
import {
  getUserId,
  request,
  timeAgo,
  useAuthDialogStore,
  useInboxActions,
  usePropActions,
  usePropState,
  WebSocketManager,
} from '@your-props/client/utils';

import 'react-tabs/style/react-tabs.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { PropLike } from './LikeProp';
import { SignIn } from '../../auth/SignIn';
import { PropComments } from './PropComments';
import { OfferPopup } from './offers/OffersPopup';
import { BiddingPopup } from './bidding/BiddingPopup';
import { BiddingTimer } from './bidding/BiddingTimer';
import { MessagesPage } from '../../dashboard/messages/Messages';
import { MoreFromCollectorProps } from './MoreFromCollectorProps';

import defaultProfileImage from '../../theme/assets/images/avatar/user-img.png?url';

export const PropDetails = () => {
  const currentUserId = getUserId();
  const isLoggedIn = !isEmpty(currentUserId);

  const navigate = useNavigate();
  const params = useParams();
  const propId = params.id || '';

  const { prop, auctionLiveBidUpdates, isFetchingProp } = usePropState();
  const { fetchProp } = usePropActions();

  const { toggleDialogVisibility } = useAuthDialogStore();
  const { toggleMessageDialogVisibility } = useAuthDialogStore();

  const [initiatingChat, setInitiatingChat] = useState(false);
  const [isOffers, setIsOffer] = useState(prop?.product?.id);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [showNewBidAnimation, setShowNewBidAnimation] = useState(false);
  const [animateIncomingBid, setAnimateIncomingBid] = useState(false);

  const dialogClassName =
    'w-auto m-[20px] md:my-[30px] md:mx-auto md:max-w-[1000px]';

  useEffect(() => {
    const fetchData = async () => {
      const found = await fetchProp(propId);
      if (!found) {
        navigate('/not-found');
      }
    };

    fetchData();
  }, [propId]);

  useEffect(() => {
    if (auctionLiveBidUpdates > 0) {
      setShowNewBidAnimation(true);

      const animateTimeout = setTimeout(() => {
        setAnimateIncomingBid(true);
      }, 10);

      const fadeOutTimeout = setTimeout(() => {
        setAnimateIncomingBid(false);
      }, 2300);

      const hideTimeout = setTimeout(() => {
        setShowNewBidAnimation(false);
      }, 3000);

      return () => {
        clearTimeout(animateTimeout);
        clearTimeout(fadeOutTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [auctionLiveBidUpdates]);

  const breadCrumbs = [
    {
      label: 'All Items',
      isActive: false,
      redirectUrl: '/props?sorting=1',
    },
    {
      label: prop?.product?.movieName || '',
      isActive: false,
      redirectUrl: `/movies/${prop?.product?.movieId}/details`,
    },
    {
      label: prop?.product?.categoryName || '',
      isActive: false,
      redirectUrl: `/props?sorting=1&category=${prop?.product?.categoryId}`,
    },
  ];

  const checkOffers = async (product_id: any) => {
    try {
      const { data } = await request.get(`offers-check/${product_id}`);
      setIsOffer(data);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const { initiateChat } = useInboxActions();

  const handleInitiateChat = async () => {
    setInitiatingChat(true);

    const chatId = await initiateChat(Number(prop?.vendorDetails?.id));

    if (chatId) {
      toggleMessageDialogVisibility(true, <MessagesPage />, dialogClassName);
    }

    setInitiatingChat(false);
  };

  const subscribeAuctionChannel = () => {
    WebSocketManager.send(`auction-${prop?.auctionsDetails?.auction?.id}`, {
      action: 'subscribe',
    });
  };

  const unsubscribeAuctionChannel = () => {
    WebSocketManager.send(`auction-${prop?.auctionsDetails?.auction?.id}`, {
      action: 'unsubscribe',
    });
  };

  useEffect(() => {
    if (prop?.product?.listingType === 'bidding') {
      subscribeAuctionChannel();
    }

    return () => {
      if (prop?.product?.listingType === 'bidding') {
        unsubscribeAuctionChannel();
      }
    };
  }, [prop?.product?.id, prop?.product?.listingType]);

  useEffect(() => {
    if (prop?.product?.id && prop?.product?.listingType === 'accepting_offer') {
      checkOffers(prop.product.id);
    }
  }, [prop?.product?.id, offerSubmitted]);

  return (
    <div className="item-details mb-20">
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      {isFetchingProp ? (
        <FullPageSpinner />
      ) : (
        prop && (
          <>
            <div className="tf-section tf-item-details featured-props-section !pt-[20px] lg:pt-[30px]">
              <div className="themesflat-container">
                <div className="row">
                  <div className="col-xl-6 col-md-12">
                    <div className="content-left">
                      <div className="media w-full ">
                        {prop.images && (
                          <Carousel
                            autoPlay
                            className={'w-full cursor-pointer'}
                            onClickItem={(index) =>
                              setSelectedImage(prop.images[index].imageBig)
                            }
                          >
                            {prop.images.map((image, index) => (
                              <img
                                key={index}
                                src={image.imageBig}
                                alt={`${prop.product?.slug}-${index}`}
                                className="w-full aspect-[75/69] h-full max-h-[750px] object-contain object-center bg-[#393939]"
                              />
                            ))}
                          </Carousel>
                        )}
                        {selectedImage && (
                          <div
                            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[100]"
                            onClick={() => setSelectedImage(null)}
                          >
                            <img
                              src={selectedImage}
                              alt="Enlarged"
                              className="max-w-full max-h-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-12">
                    <div className="content-right">
                      <div className="sc-item-details">
                        <span className="text-[24px] text-[#C5B6B3] leading-[30px]">
                          {prop.product?.movieName}
                        </span>

                        <h2 className="style2 mt-4 leading-[44px]">
                          {prop.details?.title}
                        </h2>

                        <div className="flex gap-6 flex-row justify-between my-[30px] flex-wrap">
                          <div className="flex flex-row flex-grow">
                            <div
                              className={`rounded-[10px] items-center justify-center ${
                                prop.vendorDetails?.avatar ? '' : 'bg-[#303030]'
                              }`}
                            >
                              <Link
                                to={`/user/${prop.vendorDetails?.id}/details`}
                                className="hover:text-inherit"
                              >
                                <img
                                  alt="User"
                                  width={50}
                                  height={50}
                                  className={`rounded-[10px] h-[50px] w-[50px] ${
                                    prop.vendorDetails?.avatar
                                      ? 'object-cover'
                                      : 'object-contain p-[5px]'
                                  }`}
                                  src={
                                    prop.vendorDetails?.avatar ||
                                    String(defaultProfileImage)
                                  }
                                />
                              </Link>
                            </div>

                            <div className="justify-between flex flex-col ml-[15px]  flex-grow">
                              <Link
                                to={`/user/${prop.vendorDetails?.id}/details`}
                                className="hover:text-inherit"
                              >
                                <span className="text-[18px] font-bold leading-[22px] capitalize">
                                  {prop.vendorDetails?.username}
                                </span>
                              </Link>
                              <div className="flex  flex-row">
                                <span className="text-[15px] leading-[20px] text-[#C5B6B3] font-normal">
                                  {prop.vendorDetails?.averageRating}
                                </span>
                                <SvgStarIconSm />
                                <span className="text-[15px] leading-[20px] text-[#C5B6B3] font-normal ml-2">
                                  ({prop.vendorDetails?.totalSold} Sold)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-5 flex-row">
                            <button
                              onClick={
                                !isLoggedIn
                                  ? () =>
                                      toggleDialogVisibility(true, <SignIn />)
                                  : handleInitiateChat
                              }
                              className={`w-[50px] h-[50px] p-[12px] rounded-[10px] bg-[#676767] border-[#676767] hover:opacity-90 hover:text-white hover:border-[#676767] disabled:pointer-events-none disabled:opacity-70`}
                              disabled={
                                initiatingChat ||
                                currentUserId === prop.vendorDetails.id
                              }
                            >
                              <SvgFollow />
                            </button>

                            <PropLike
                              propId={prop.product.id}
                              disabled={currentUserId === prop.product?.userId}
                            />

                            <button className="w-[50px] h-[50px] p-[12px] rounded-[10px] bg-[#676767] border-[#676767] hover:opacity-90 hover:text-white hover:border-[#676767]">
                              <SvgShare />
                            </button>
                          </div>
                        </div>

                        {/*Accepting Offers*/}
                        {prop.product?.listingType === 'accepting_offer' &&
                          currentUserId !== prop.product?.userId && (
                            <div className="rounded-xl bg-[#393939] p-[20px] sm:p-[34px] mb-[30px]">
                              <div className="flex justify-center w-full">
                                <button
                                  id="load-more"
                                  onClick={() =>
                                    isLoggedIn
                                      ? toggleDialogVisibility(
                                          true,
                                          <OfferPopup
                                            productId={prop?.product?.id ?? ''}
                                            isPendingOfferExists={isOffers}
                                            offerSubmitted={offerSubmitted}
                                            setOfferSubmitted={
                                              setOfferSubmitted
                                            }
                                          />
                                        )
                                      : toggleDialogVisibility(true, <SignIn />)
                                  }
                                  className="text-[20px] font-semibold whitespace-nowrap h-[60px] sm:px-[60px] rounded-xl focus:text-white hover:text-white hover:opacity-90"
                                >
                                  <HandShakeIcon className="inline mr-3" /> Make
                                  an Offer
                                </button>
                              </div>
                            </div>
                          )}

                        {/*Logged In & Buy it now*/}
                        {prop.product?.listingType === 'sell_on_site' &&
                          currentUserId !== prop.product?.userId && (
                            <div className="rounded-xl bg-[#393939] p-[20px] sm:p-[34px] mb-[30px]">
                              <div className="w-full flex justify-between flex-col sm:flex-row gap-5">
                                <div>
                                  <h3 className="text-[18px] text-[#C5B6B3] leading-[22px] font-normal mb-[6px]">
                                    Price
                                  </h3>
                                  <h1 className="text-[30px] font-bold capitalize">
                                    {prop.product?.price}{' '}
                                    {prop.product?.currency}
                                  </h1>
                                </div>

                                <PropCartButton
                                  itemId={toNumber(prop.product?.id)}
                                  stock={toNumber(prop.product?.stock)}
                                  isLoggedIn={isLoggedIn}
                                  handleLogin={() =>
                                    toggleDialogVisibility(true, <SignIn />)
                                  }
                                />
                              </div>
                            </div>
                          )}

                        {/*Logged In & Auction*/}
                        {prop.product?.listingType === 'bidding' && (
                          <div className="rounded-xl bg-[#393939] p-[20px] sm:p-[34px] mb-[30px]">
                            <div className="w-full">
                              <BiddingTimer
                                inline={false}
                                auction={prop.auctionsDetails?.auction}
                              />

                              <div className="flex justify-between flex-col gap-8 md:flex-row relative">
                                <div className="flex flex-col">
                                  <span className="text-[18px] text-[#C5B6B3] leading-[22px] font-normal mb-[6px]">
                                    {prop.auctionsDetails?.auction.status ===
                                    'ended'
                                      ? 'Winning Bid'
                                      : prop.auctionsDetails.bids?.length === 0
                                      ? 'Starting Bid'
                                      : 'Highest Bid'}
                                  </span>

                                  {prop.auctionsDetails && (
                                    <span className="text-[30px] font-bold capitalize">
                                      {prop.auctionsDetails?.auction.status ===
                                        'ended' &&
                                      prop.product?.bidsCount === '0' ? (
                                        'N/A'
                                      ) : (
                                        <>
                                          {getItemPriceString(
                                            prop.auctionsDetails?.highestBid ??
                                              prop.auctionsDetails?.auction
                                                ?.startingPrice
                                          )}{' '}
                                          {prop.product?.currency}
                                        </>
                                      )}

                                      <span className="text-[18px] text-[#C5B6B3] leading-[22px] font-normal ml-2">
                                        {Array.isArray(
                                          prop.auctionsDetails?.bids
                                        ) &&
                                          `(${
                                            prop.auctionsDetails.bids.length
                                          } ${
                                            prop.auctionsDetails.bids.length >
                                              1 ||
                                            prop.auctionsDetails.bids.length ===
                                              0
                                              ? 'bids'
                                              : 'bid'
                                          })`}
                                      </span>
                                    </span>
                                  )}
                                </div>

                                {isLoggedIn &&
                                  currentUserId !== prop.product?.userId &&
                                  prop.auctionsDetails?.auction.status !==
                                    'scheduled' && (
                                    <div className="flex flex-col">
                                      {prop.auctionsDetails?.userSecretBid &&
                                      prop.auctionsDetails?.userSecretBid >
                                        (prop.auctionsDetails?.highestBid ??
                                          0) ? (
                                        <>
                                          <span className="text-[18px] text-[#C5B6B3] leading-[22px] font-normal text-right">
                                            Your Secret Maximum Bid
                                          </span>
                                          <span className="text-[30px] font-bold capitalize text-right mt-[6px]">
                                            {getItemPriceString(
                                              prop.auctionsDetails
                                                ?.userSecretBid
                                            )}{' '}
                                            {prop.product?.currency}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-[18px] text-[#C5B6B3] leading-[22px] font-normal md:text-right">
                                            Your Highest Bid
                                          </span>
                                          <span className="text-[30px] font-bold capitalize md:text-right mt-[6px]">
                                            {prop.auctionsDetails
                                              ?.userHighestBid
                                              ? `${getItemPriceString(
                                                  prop.auctionsDetails
                                                    ?.userHighestBid
                                                )} ${prop.product?.currency}`
                                              : '-'}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  )}

                                {showNewBidAnimation && (
                                  <div
                                    className={`absolute bg-[#393939] w-full h-full top-0 font-semibold flex justify-center items-center overflow-hidden transition-all duration-700 ease-out ${
                                      animateIncomingBid
                                        ? 'gap-[20px] opacity-100'
                                        : 'gap-[300px] opacity-0'
                                    }`}
                                  >
                                    <div className="w-[100px] flex-shrink-0 flex-grow text-right text-[42px] font-bold">
                                      ${prop.auctionsDetails.highestBid}
                                    </div>
                                    <div className="text-[32px] text-[#ef6a3b] animate-count">
                                      /
                                    </div>
                                    <div className="w-[100px] flex-shrink-0 flex-grow text-left text-[18px]">
                                      NEW
                                      <br />
                                      BID
                                    </div>
                                  </div>
                                )}
                              </div>

                              {prop.auctionsDetails?.auction.status !==
                                'ended' && (
                                <div className="mt-[30px]">
                                  {prop.auctionsDetails?.auction.status ===
                                  'scheduled' ? (
                                    <button
                                      disabled
                                      className="text-[20px] font-semibold whitespace-nowrap h-[60px] px-[60px] rounded-xl bg-[#222222] border-none focus:text-white hover:text-white hover:opacity-90 disabled:opacity-70"
                                    >
                                      Starting Soon
                                    </button>
                                  ) : isLoggedIn &&
                                    currentUserId === prop.product?.userId ? (
                                    <button
                                      disabled
                                      className="text-[20px] font-semibold whitespace-nowrap h-[60px] px-[60px] rounded-xl bg-[#222222] border-none focus:text-white hover:text-white hover:opacity-90 disabled:opacity-70"
                                    >
                                      Bidding In Progress
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        isLoggedIn
                                          ? toggleDialogVisibility(
                                              true,
                                              <BiddingPopup />
                                            )
                                          : toggleDialogVisibility(
                                              true,
                                              <SignIn />
                                            )
                                      }
                                      className="text-[20px] font-semibold whitespace-nowrap h-[60px] px-[60px] rounded-xl focus:text-white hover:text-white hover:opacity-90"
                                    >
                                      Place Bid
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flat-tabs themesflat-tabs mb-[30px]">
                          <Tabs>
                            <TabList>
                              <Tab>Information</Tab>
                              {prop.product?.listingType === 'bidding' && (
                                <Tab>Bid History</Tab>
                              )}
                            </TabList>

                            <TabPanel>
                              <div className="provenance">
                                <p>{prop.details?.description}</p>
                              </div>
                            </TabPanel>

                            {prop.product?.listingType === 'bidding' && (
                              <TabPanel className="max-h-[350px] overflow-y-scroll">
                                {prop.auctionsDetails?.bids?.length > 0 ? (
                                  prop.auctionsDetails?.bids?.map(
                                    (bid: any) => {
                                      return (
                                        <div
                                          className="flex flex-row mt-[19px]"
                                          key={bid.id}
                                        >
                                          <div className="flex flex-col">
                                            <div className="flex flex-row gap-4 items-center">
                                              <span className="text-[14px] font-semibold leading-[20px]">
                                                Incoming Bid
                                              </span>
                                              <span className="text-[14px] leading-[20px] text-[#C5B6B3]">
                                                {timeAgo(
                                                  bid?.bidTime || bid?.bid_time
                                                )}
                                              </span>
                                            </div>

                                            <span className="text-[14px] leading-[22px]">
                                              ${bid?.bidPrice || bid?.bid_price}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )
                                ) : (
                                  <div className="text-[14px] mt-2 mb-10">
                                    No bid history found.
                                  </div>
                                )}
                              </TabPanel>
                            )}
                          </Tabs>
                        </div>

                        <div
                          style={{
                            border: '1px solid rgba(197, 182, 179, 0.40)',
                          }}
                          className="flex flex-col gap-6 sm:gap-0 sm:flex-row justify-between rounded-[10px] border-[1px] border-[#393939]/40 py-[21px] px-[34px] bg-[#393939]/30"
                        >
                          <div className="flex flex-col w-full">
                            <span className="text-[#C5B6B3] text-[15px] leading-[22px]">
                              Category:
                            </span>
                            <span className="text-[#EBEBEB] text-[14px] text-truncate max-w-[180px] font-bold leading-[22px] capitalize">
                              {prop.product?.categoryName}
                            </span>
                          </div>
                          <div
                            className="mr-[30px]"
                            style={{
                              borderRight:
                                '1px solid rgba(197, 182, 179, 0.40)',
                            }}
                          />

                          <div className="flex flex-col w-full">
                            <span className="text-[#C5B6B3] text-[15px] leading-[22px]">
                              Type:
                            </span>
                            <span className="text-[#EBEBEB] text-[14px] text-truncate max-w-[180px] font-bold leading-[22px] capitalize">
                              {prop.product?.productType || ''}
                            </span>
                          </div>
                          <div
                            className="mr-[30px]"
                            style={{
                              borderRight:
                                '1px solid rgba(197, 182, 179, 0.40)',
                            }}
                          />

                          <div className="flex flex-col w-full">
                            <span className="text-[#C5B6B3] text-[15px] leading-[22px]">
                              Actors:
                            </span>
                            <span
                              title={prop.product?.actorName}
                              className="text-[#EBEBEB] text-[14px] text-truncate max-w-[180px] font-bold leading-[22px] capitalize"
                            >
                              {prop.product?.actorName || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            border: '1px solid rgba(197, 182, 179, 0.40)',
                          }}
                          className="mt-4 flex flex-col gap-6 sm:gap-0 sm:flex-row justify-between rounded-[10px] border-[1px] border-[#393939]/40 py-[21px] px-[34px] bg-[#393939]/30"
                        >
                          <div className="flex flex-col w-full">
                            <span className="text-[#C5B6B3] text-[15px] leading-[22px]">
                              Certificate of Authenticity:
                            </span>
                            <span className="text-[#EBEBEB] text-[14px] text-truncate max-w-[180px] font-bold leading-[22px] capitalize">
                              {prop.product?.coa || 'N/A'}
                            </span>
                          </div>
                          <div
                            className="mr-[30px]"
                            style={{
                              borderRight:
                                '1px solid rgba(197, 182, 179, 0.40)',
                            }}
                          />

                          <div className="flex flex-col w-full">
                            <span className="text-[#C5B6B3] text-[15px] leading-[22px]">
                              Character Name:
                            </span>
                            <span
                              title={prop.product?.characterName}
                              className="text-[#EBEBEB] text-[14px] text-truncate max-w-[180px] font-bold leading-[22px] capitalize"
                            >
                              {prop.product?.characterName || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <PropComments propId={prop?.product?.id ?? ''} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {prop.vendorProducts && prop.vendorProducts.length > 0 && (
              <MoreFromCollectorProps
                userId={prop?.vendorDetails?.id ?? ''}
                vendorProducts={prop.vendorProducts}
              />
            )}
          </>
        )
      )}
    </div>
  );
};
