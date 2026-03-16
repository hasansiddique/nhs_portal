import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { isEmpty, toNumber } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { NoContentPage, Spinner } from '@your-props/client/ui';
import {
  useCartState,
  CartItem,
  useSidebarActions,
  useAuthDialogStore,
  useCartActions,
} from '@your-props/client/utils';

import { SignIn } from '../../../auth/SignIn';
import { CartCheckoutItem } from './CartCheckoutItem';
import { ProfileDetailsRequired } from '../ProfileDetailsRequired';

export const CartContent = ({
  showButton = true,
  totalShippingCost,
  setSelectedShippingCosts,
}: {
  showButton?: boolean;
  totalShippingCost?: any;
  setSelectedShippingCosts?: any;
}) => {
  const navigate = useNavigate();
  const { isInitialized, isFetchingItems, cartItems, cartCount, cartTotal } = useCartState();
  const { closeSidebar } = useSidebarActions();
  const { fetchCartItems } = useCartActions();
  const { toggleDialogVisibility } = useAuthDialogStore();

  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  useEffect(() => {
    if (isLoggedIn && !isInitialized) {
      fetchCartItems();
    }
  }, [isLoggedIn]);

  const navigateToDashboard = () => {
    if (isEmpty(currentUser?.countryId)) {
      toggleDialogVisibility(true, <ProfileDetailsRequired />);
    } else {
      closeSidebar();
      navigate(`/dashboard/checkout`);
    }
  };

  const handleAddMoreProps = () => {
    closeSidebar();
    navigate(`/props?sorting=1`);
  };

  const cleanPrice = cartTotal?.replace(/,/g, '') || '0';
  const formattedPrice = parseFloat(cleanPrice) || 0;
  const finalTotal = formattedPrice + totalShippingCost;

  return isLoggedIn ? (
    <div>
      <p className="text-[24px] font-bold leading-[44px] capitalize">
        {`Order Summary (${cartCount})`}
      </p>
      {isFetchingItems ? (
        <div className="flex my-10 items-center justify-center">
          <Spinner />
        </div>
      ) : cartItems?.length > 0 ? (
        <>
          {cartItems?.map((item: CartItem, index) => (
              <CartCheckoutItem
                key={index}
                id={item.id}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                productId={item.productId}
                defaultImage={item.defaultImage}
                shippingDetails={item.shippingDetails}
                shortDescription={item.shortDescription}
                setSelectedShippingCosts={setSelectedShippingCosts}
              />
          ))}

          <div className="pt-10">
            <div style={{ border: '0.5px solid #C5B6B3' }} className="my-4" />
          </div>

          {totalShippingCost  ? (
            <div className="flex flex-row justify-between py-6 px-1">
              <p className="text-[18px] font-bold leading-[22px] text-[#EDE8E7]">
                Shipping Cost
              </p>
              <p className="text-[18px] font-bold leading-[22px] text-[#EDE8E7]">{`$${totalShippingCost}`}</p>
            </div>
          ) : ''}

          <div className="flex flex-row justify-between py-6 px-1">
            <p className="text-[18px] font-bold leading-[22px] text-[#EDE8E7]">
              Total
            </p>
            <p className="text-[18px] font-bold leading-[22px] text-[#EDE8E7]">{`$${cartTotal}`}</p>
          </div>

          {totalShippingCost ? (
            <>
              <div className="">
                <div
                  style={{ border: '0.5px solid #C5B6B3' }}
                  className="my-4"
                />
              </div>
              <div className="flex flex-row justify-between py-6 px-1">
                <p className="text-[18px] font-bold leading-[22px] text-[#EDE8E7]">
                  Grand Total
                </p>
                <p className="text-[18px] font-bold leading-[22px] text-[#EDE8E7]">{`$${finalTotal}`}</p>
              </div>
            </>
          ) : ''}

          {showButton && (
            <>
              <div className="pt-10">
                <button
                  onClick={navigateToDashboard}
                  className="rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] h-[54px] w-full hover:opacity-90 hover:text-white focus:text-white"
                >
                  <span className="text-[15px]">Continue to Checkout</span>
                </button>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleAddMoreProps}
                  className="rounded-[10px] bg-[#676767] border-[#676767] whitespace-nowrap w-full h-[54px] hover:opacity-90 hover:text-white focus:text-white "
                >
                  <span className="text-[15px] flex flex-row justify-center items-center">
                    Add More Items
                  </span>
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <NoContentPage
          subText="No items added to the cart"
          showBackgroundColor={false}
        />
      )}
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center h-full">
      <p className="font-semibold">Please Login to see items in cart.</p>
      <button
        onClick={() => toggleDialogVisibility(true, <SignIn />)}
        className="submit rounded-[10px] social-login-submit mt-20 w-full focus:text-white hover:text-white"
      >
        Login
      </button>
    </div>
  );
};
