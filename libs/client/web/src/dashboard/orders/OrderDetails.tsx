import { toast } from 'sonner';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  formatDate,
  request,
  useAuthDialogStore,
  useInboxActions,
} from '@your-props/client/utils';
import { SvgFollow, SvgStarIconSm } from '@your-props/client/icons';
import { NoContentPage, Spinner } from '@your-props/client/ui';

import { CompleteOrder } from './CompleteOrder';
import { RejectOrder } from './RejectOrder';
import { DashboardLayout } from '../Dashboard';
import { MessagesPage } from '../messages/Messages';
import { CreateQuoteForm } from './CreateQuoteForm';
import { AcceptQuoteForm } from './AcceptQuoteForm';
import { RejectQuoteForm } from './RejectQuoteForm';
import { DisputeForm } from './DisputeForm';
import { FeedbackForm } from '../feedback/FeedBackForm';

import profileImage from '../../theme/assets/images/avatar/user-img.png';

export const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id as string;

  const dialogClassName =
    'w-auto m-[20px] md:my-[30px] md:mx-auto md:max-w-[1000px]';

  const orderId = params.id;

  useEffect(() => {
    getOrderDetails();
  }, []);

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const { toggleDialogVisibility, toggleMessageDialogVisibility } =
    useAuthDialogStore();

  const [orderDetails, setOrdersList] = useState({
    orderId: '',
    status: '',
    buyerId: '',
    sellerId: '',
    createdAt: '',
    orderNumber: '',
    paymentStatus: '',
    priceTotal: '',
    priceShipping: '',
    priceGrandTotal: '',
    priceCurrency: '',
    shippingDays: '',
    shippingTrackingNumber: '',
    sellerDetails: {
      avatar: '',
      username: '',
      totalSold: '',
      averageRating: '',
    },
    buyerDetails: {
      avatar: '',
      username: '',
      email: '',
    },
    shipping: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      email: '',
      phone: '',
    },
    orderProducts: {
      id: '',
      slug: '',
      price: '',
      currency: '',
      title: '',
      productDescription: '',
      shippingMethodSelected: '',
      quantity: '',
      images: [{ imageSmall: '' }],
    },
    review: {
      id: '',
      rating: '',
      review: '',
      subject: '',
    },
  });
  const [loadingOrder, setLoadingOrder] = useState(true);

  const getOrderDetails = async (showLoader = true, fetchMore = false) => {
    if (showLoader) setLoadingOrder(true);

    try {
      const { data } = await request.get(`/fetch-order/${orderId}`);
      setOrdersList(data?.orderData);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || 'Something went wrong.'
      );
      navigate('/dashboard/orders');
    } finally {
      setLoadingOrder(false);
    }
  };

  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Dashboard',
      isActive: false,
      redirectUrl: '/dashboard/props',
    },
    {
      label: 'Orders',
      isActive: false,
      redirectUrl: '/dashboard/orders',
    },
    {
      label: orderDetails?.orderNumber,
      isActive: false,
    },
  ];

  const [initiatingChat, setInitiatingChat] = useState(false);
  const { initiateChat } = useInboxActions();

  const handleInitiateChat = async (id: any) => {
    setInitiatingChat(true);

    const chatId = await initiateChat(Number(id));

    if (chatId) {
      toggleMessageDialogVisibility(true, <MessagesPage />, dialogClassName);
    }

    setInitiatingChat(false);
  };

  const getShippingMethodLabel = (type: string) => {
    switch (type) {
      case 'domestic':
        return 'Domestic Shipping';

      case 'international':
        return 'International Shipping';

      case 'self_collect':
        return 'Local Pickup';

      default:
        return 'NA';
    }
  };

  const showUserDetails = (userData: any) => {
    return (
      <div className="mt-2">
        <div className="flex items-center flex-row gap-3">
          <div className="rounded-[10px] items-center justify-center">
            <Link
              to={`/user/${userData?.id}/details`}
              className="hover:text-inherit"
            >
              <img
                alt="User"
                // width={50}
                // height={50}
                src={userData?.avatar || profileImage}
                className="rounded-[10px] h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] object-cover default_image"
              />
            </Link>
          </div>

          <div className="justify-between flex flex-col sm:ml-[15px]">
            <Link
              to={`/user/${userData?.id}/details`}
              className="hover:text-inherit"
            >
              <span className="text-[18px] font-bold leading-[22px] capitalize">
                {`${userData?.username}`}
              </span>
            </Link>

            <div className="flex  flex-row">
              <span className="text-[15px] leading-[20px] text-[#C5B6B3] font-normal">
                {userData?.averageRating || 0}
              </span>
              <SvgStarIconSm />
              <span className="text-[15px] leading-[20px] text-[#C5B6B3] font-normal ml-2">
                ({userData?.totalSold || 0} Sold)
              </span>
            </div>
          </div>

          <button
            onClick={() => handleInitiateChat(userData?.id)}
            className="h-[40px] w-[40px] sm:w-auto sm:h-auto flex sm:inline-block justify-center sm:ml-[32px] px-[0] sm:!px-[14px] py-[10px] rounded-[10px] bg-[#676767] border-[#676767] hover:opacity-90 hover:text-white hover:border-[#676767]"
          >
            <SvgFollow />
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full mt-[20px] lg:mt-0">
        {loadingOrder ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : orderDetails ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h1 className="text-[24px] mb-[20px]">Order Summary</h1>

              <div className="flex flex-wrap justify-end gap-6">
                {orderDetails?.status !== 'ORDER_COMPLETED' &&
                  orderDetails?.status !== 'PAYMENT_COMPLETED' && (
                    <div className="text-right">
                      {orderDetails?.status === 'ORDER_CANCELLED' ? (
                        <p className="font-bold text-[18px] mb-[20px]">
                          Order Cancelled
                        </p>
                      ) : (
                        <button
                          onClick={() =>
                            toggleMessageDialogVisibility(
                              true,
                              <RejectOrder
                                getOrderDetails={getOrderDetails}
                                orderId={orderDetails?.orderId}
                              />
                            )
                          }
                          className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#c41a1a] border-[#c41a1a] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none mb-[20px]"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}

                {/* @todo - enable once the dispute flow is sorted */}
                {/*{(orderDetails?.status === 'ORDER_COMPLETED' ||
                  orderDetails?.status === 'PAYMENT_COMPLETED') && (
                  <button
                    onClick={() =>
                      toggleMessageDialogVisibility(
                        true,
                        <DisputeForm
                          getOrderDetails={getOrderDetails}
                          orderId={orderDetails?.orderId}
                        />
                      )
                    }
                    className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#c41a1a] border-[#c41a1a] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none mb-[20px]"
                  >
                    Create Dispute
                  </button>
                )}*/}

                {orderDetails?.status === 'ORDER_COMPLETED' &&
                  orderDetails?.buyerId === userId &&
                  !orderDetails?.review && (
                    <button
                      className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none mb-[20px]"
                      onClick={() =>
                        toggleDialogVisibility(
                          true,
                          <FeedbackForm
                            orderId={orderDetails.orderId}
                            sellerId={orderDetails.sellerId}
                            getOrderDetails={getOrderDetails}
                          />,
                          dialogClassName
                        )
                      }
                    >
                      Post A Review
                    </button>
                  )}
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-[3rem] md:flex-row md:gap-0 justify-between md:items-center bg-[#393939]/90 rounded-[10px] p-[20px] sm:p-[40px] mb-[20px]">
                <div className="flex flex-col">
                  <p className="uppercase text-[18px] text-[#C5B6B3] font-bold leading-[26px] mb-3">
                    {`${
                      orderDetails?.buyerId === userId ? 'Seller' : 'Buyer'
                    } Details`}
                  </p>

                  <span>
                    {showUserDetails(
                      orderDetails?.sellerId === userId
                        ? {
                            ...orderDetails.buyerDetails,
                            id: orderDetails.buyerId,
                          }
                        : {
                            ...orderDetails?.sellerDetails,
                            id: orderDetails?.sellerId,
                          }
                    )}
                  </span>
                </div>
                <div>
                  <table className="table table-custom border-0 m-0">
                    <tbody>
                      <tr>
                        <td className="border-0 p-0 pr-4">
                          <p className="text-[16px] leading-[20px] my-[8px]">
                            Order Number:
                          </p>
                        </td>
                        <td className="border-0 p-0">
                          <p
                            title={orderDetails?.orderNumber}
                            className="text-[16px] leading-[20px]"
                          >
                            <strong>{orderDetails?.orderNumber}</strong>
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td className="border-0 p-0 pr-4">
                          <p className="text-[16px] leading-[20px] my-[8px]">
                            Date Placed:
                          </p>
                        </td>
                        <td className="border-0 p-0">
                          <p
                            title={formatDate(orderDetails?.createdAt)}
                            className="text-[18px] text-truncate whitespace-nowrap"
                          >
                            <strong>
                              {formatDate(orderDetails?.createdAt)}
                            </strong>
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td className="border-0 p-0 pr-4">
                          <p className="text-[16px] leading-[20px] my-[8px]">
                            Grand Total:
                          </p>
                        </td>
                        <td className="border-0 p-0">
                          <p className="text-[16px]">
                            <strong>
                              {orderDetails?.priceCurrency}{' '}
                              {orderDetails?.priceGrandTotal}
                            </strong>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h2 className="text-[24px] mb-[20px]">Shipping Details</h2>
              <div className="flex flex-col md:flex-row gap-[20px]">
                <div className="flex-grow bg-[#393939]/90 rounded-[10px] p-[20px] sm:p-[40px] md:mb-[20px]">
                  <p className="uppercase text-[18px] text-[#C5B6B3] font-bold leading-[26px]">
                    Shipping Address
                  </p>

                  {/* table */}
                  <div className="table-responsive mt-[20px]">
                    <table className="table table-custom border-0">
                      <tbody>
                        <tr>
                          <td className="border-0 p-0 pr-4">
                            <p className="text-[18px] font-extrabold leading-[24px] my-[8px] capitalize">
                              Name:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            <p
                              title={orderDetails?.shipping?.firstName}
                              className="text-[16px] text-truncate"
                            >
                              {orderDetails?.shipping?.firstName}{' '}
                              {orderDetails?.shipping?.lastName}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td className="border-0 p-0 pr-4">
                            <p className="text-[18px] font-extrabold leading-[24px] my-[8px] capitalize">
                              Phone:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            <p
                              title={orderDetails?.shipping?.phone}
                              className="text-[18px] text-truncate whitespace-nowrap"
                            >
                              {orderDetails?.shipping?.phone}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td className="border-0 p-0 pr-4">
                            <p className="text-[18px] font-bold leading-[24px] my-[8px] capitalize">
                              Address:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            <p
                              title={orderDetails?.shipping?.address}
                              className="text-[16px]"
                            >
                              {orderDetails?.shipping?.address},{' '}
                              {orderDetails?.shipping?.city},{' '}
                              {orderDetails?.shipping?.state},{' '}
                              {orderDetails?.shipping?.zip}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td className="border-0 p-0 pr-4">
                            <p className="text-[18px] font-extrabold leading-[24px] my-[8px] capitalize">
                              Country:
                            </p>
                          </td>
                          <td className="border-0 p-0">
                            <p
                              title={orderDetails?.shipping?.country}
                              className="text-[16px] w-[15rem] whitespace-nowrap"
                            >
                              {orderDetails?.shipping?.country}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex-grow flex flex-col bg-[#393939]/90 rounded-[10px] p-[20px] sm:p-[40px] mb-[20px]">
                  <div className="uppercase text-[18px] text-[#C5B6B3] font-bold leading-[26px] mb-[30px]">
                    {orderDetails?.status === 'AWAITING_QUOTE' &&
                      'Awaiting Shipping Quote'}
                    {orderDetails?.status === 'QUOTE_PROVIDED' &&
                      'Shipping Quote Provided'}
                    {orderDetails?.status === 'QUOTE_REJECTED' &&
                      'Shipping Quote Rejected'}
                    {orderDetails?.status === 'AWAITING_PAYMENT' &&
                      'Awaiting Payment'}
                    {orderDetails?.status === 'PAYMENT_COMPLETED' &&
                      'Payment Processed'}
                    {orderDetails?.status === 'ORDER_COMPLETED' && (
                      <>
                        {orderDetails?.review ? (
                          <div>Customer Review</div>
                        ) : (
                          'Order Completed'
                        )}
                      </>
                    )}
                    {orderDetails?.status === 'ORDER_CANCELLED' &&
                      'Shipping Information'}
                  </div>

                  {![
                    'AWAITING_QUOTE',
                    'PAYMENT_COMPLETED',
                    'ORDER_COMPLETED',
                  ].includes(orderDetails?.status) && (
                    <div>
                      <table className="table table-custom border-0">
                        <tbody>
                          <tr>
                            <td className="border-0 p-0 pr-4">
                              <p className="text-[16px] leading-[24px] whitespace-nowrap my-[8px] capitalize">
                                Shipping Method Selected:
                              </p>
                            </td>
                            <td className="border-0 p-0">
                              <p className="text-[22px] font-bold text-truncate">
                                {getShippingMethodLabel(
                                  orderDetails?.orderProducts
                                    ?.shippingMethodSelected
                                )}
                              </p>
                            </td>
                          </tr>

                          <tr>
                            <td className="border-0 p-0 pr-4">
                              <p className="text-[16px] leading-[24px] my-[8px] capitalize">
                                Shipping Fee:
                              </p>
                            </td>
                            <td className="border-0 p-0">
                              <p className="text-[22px] font-bold text-truncate whitespace-nowrap">
                                {orderDetails?.priceCurrency}{' '}
                                {orderDetails?.priceShipping}
                              </p>
                            </td>
                          </tr>

                          <tr>
                            <td className="border-0 p-0 pr-4">
                              <p className="text-[16px] leading-[24px] my-[8px] capitalize">
                                Delivery In:
                              </p>
                            </td>
                            <td className="border-0 p-0">
                              <p className="text-[22px] font-bold">
                                {orderDetails?.shippingDays} Days
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {orderDetails?.status === 'PAYMENT_COMPLETED' &&
                    (orderDetails?.sellerId === userId ? (
                      <div className="flex flex-col justify-center items-center h-full">
                        <p className="text-center mb-3">
                          Waiting for you to ship the order.
                        </p>

                        <button
                          onClick={() =>
                            toggleMessageDialogVisibility(
                              true,
                              <CompleteOrder
                                getOrderDetails={getOrderDetails}
                                orderId={orderDetails?.orderId}
                              />
                            )
                          }
                          className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none mb-[20px]"
                        >
                          Mark Shipped
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full">
                        <p className="text-center">
                          Waiting for seller to ship the order.
                        </p>
                      </div>
                    ))}

                  {orderDetails?.status === 'ORDER_COMPLETED' && (
                    <div className="flex flex-col justify-center items-center h-full">
                      {orderDetails?.review ? (
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            {[
                              ...Array(parseInt(orderDetails.review.rating)),
                            ].map((_, i) => (
                              <span
                                key={i}
                                className="text-yellow-500 text-[30px]"
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="font-semibold text-lg">
                            {orderDetails.review.subject}
                          </p>
                          <p className="italic mt-2">
                            "{orderDetails.review.review}"
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-center mb-4">
                            Order has been shipped.
                          </p>

                          <p className="text-center">Tracking #</p>
                          <p className="text-center font-bold">
                            {orderDetails?.shippingTrackingNumber}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {orderDetails?.status === 'AWAITING_QUOTE' &&
                    (orderDetails?.sellerId === userId ? (
                      <div className="flex flex-col justify-center items-center h-full">
                        <p className="text-center mb-3">
                          Waiting for you to provide a shipping quote.
                        </p>

                        <button
                          onClick={() =>
                            toggleMessageDialogVisibility(
                              true,
                              <CreateQuoteForm
                                getOrderDetails={getOrderDetails}
                                orderId={orderDetails?.orderId}
                              />
                            )
                          }
                          className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none"
                        >
                          Provide A Quote
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full">
                        <p className="text-center">
                          Waiting for seller to provide a shipping quote.
                        </p>
                      </div>
                    ))}

                  {orderDetails?.status === 'QUOTE_PROVIDED' &&
                    (orderDetails?.buyerId === userId ? (
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-[20px] h-full">
                        <button
                          onClick={() =>
                            toggleMessageDialogVisibility(
                              true,
                              <AcceptQuoteForm
                                getOrderDetails={getOrderDetails}
                                orderId={orderDetails?.orderId}
                              />
                            )
                          }
                          className="whitespace-nowrap text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none"
                        >
                          Accept Quote
                        </button>
                        <button
                          onClick={() =>
                            toggleMessageDialogVisibility(
                              true,
                              <RejectQuoteForm
                                getOrderDetails={getOrderDetails}
                                orderId={orderDetails?.orderId}
                              />
                            )
                          }
                          className="whitespace-nowrap text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#676767] border-[#676767] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none"
                        >
                          Reject Quote
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-end items-center h-full mt-[20px]">
                        <button
                          onClick={() =>
                            toggleMessageDialogVisibility(
                              true,
                              <CreateQuoteForm
                                getOrderDetails={getOrderDetails}
                                orderId={orderDetails?.orderId}
                              />
                            )
                          }
                          className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none"
                        >
                          Update Quote
                        </button>
                      </div>
                    ))}

                  {orderDetails?.status === 'QUOTE_REJECTED' &&
                    (orderDetails?.sellerId === userId ? (
                      <div className="flex flex-col justify-end items-center h-full mt-[20px]">
                        <button
                          onClick={() =>
                            toggleMessageDialogVisibility(
                              true,
                              <CreateQuoteForm
                                getOrderDetails={getOrderDetails}
                                orderId={orderDetails?.orderId}
                              />
                            )
                          }
                          className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none"
                        >
                          Provide New Quote
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full">
                        <p className="text-center">
                          Waiting for seller to provide a new quote.
                        </p>
                      </div>
                    ))}

                  {orderDetails?.status === 'AWAITING_PAYMENT' &&
                    (orderDetails?.buyerId === userId ? (
                      <div className="flex flex-col justify-end items-center h-full mt-[20px]">
                        <button
                          onClick={async () => {
                            try {
                              const { data } = await request.post(
                                `/proceed-payment`,
                                { orderId: orderDetails?.orderId }
                              );
                              if (data.link) {
                                toast.success(
                                  'You will be redirected shortly.'
                                );
                                setTimeout(() => {
                                  window.location.href = data.link;
                                }, 2000);
                              } else {
                                toast.success(
                                  data.message ||
                                    'Payment initiated successfully'
                                );
                              }
                            } catch (err: any) {
                              toast.error(
                                err.response?.data?.message ||
                                  'Failed to initiate payment'
                              );
                            }
                          }}
                          className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none"
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-end items-center h-full">
                        <p className="text-center mt-[15px] leading-[20px]">
                          Waiting for buyer to complete payment.
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Order item */}
              <div>
                {orderDetails?.orderProducts ? (
                  <>
                    <h2 className="text-[24px] mb-[20px]">Order Item</h2>

                    <div className="relative my-[12px] p-[20px] sm:p-[40px] rounded-[10px] bg-[#393939]/90">
                      <div className="flex flex-col sm:flex-row gap-[20px] w-full">
                        <div className="flex gap-[20px] w-full">
                          <img
                            alt={orderDetails?.orderProducts?.slug}
                            width={100}
                            height={100}
                            src={
                              orderDetails?.orderProducts?.images[0]?.imageSmall
                            }
                            className="w-[100px] h-[100px] rounded-[10px] object-cover"
                          />

                          <div className="flex flex-col justify-between w-full gap-4">
                            <div className="">
                              <p className="text-[16px] sm:text-[18px] font-bold leading-[22px] text-[#EDE8E7]">
                                {orderDetails?.orderProducts?.title}
                              </p>
                              <p className="text-[18px] font-normal leading-[22px] mt-1 text-[#C5B6B3]">
                                {orderDetails?.orderProducts?.productDescription?.slice(
                                  0,
                                  200
                                )}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between">
                              <div className="flex flex-row items-center gap-2">
                                <p className="text-[16px] sm:text-[18px] font-bold leading-[22px] text-[#EDE8E7]">
                                  Quantity:
                                </p>
                                <p className="text-[16px] sm:text-[18px] font-normal leading-[22px] ml-1 text-[#EDE8E7]">
                                  {orderDetails?.orderProducts?.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:gap-0 justify-between items-end align-self-stretch">
                          <p className="text-[18px] sm:text-[22px] mr-2 sm:mr-0 font-bold leading-[22px] text-[#EDE8E7] whitespace-nowrap">
                            {orderDetails?.orderProducts?.currency}{' '}
                            {orderDetails?.orderProducts?.price}
                          </p>
                          <Link
                            to={`/${orderDetails?.orderProducts?.slug}`}
                            className="hover:text-inherit"
                          >
                            <button className="text-center h-[40px] px-[15px] py-1 rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70 disabled:border-none">
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-[14px] text-center py-10">
                    No items found
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <NoContentPage subText="No order details found" isSpacing={false} />
        )}
      </div>
    </DashboardLayout>
  );
};
