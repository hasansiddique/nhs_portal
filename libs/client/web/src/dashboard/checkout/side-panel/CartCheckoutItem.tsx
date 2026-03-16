import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useCartState,
  CartItem,
  useCartActions,
  useAuthDialogStore,
} from '@your-props/client/utils';
import { PlusIcon, SubtractIcon, SvgTrashIcon } from '@your-props/client/icons';

import posterImage from '../../../theme/assets/images/avatar/poster 1.jpg';

export const CartCheckoutItem = ({
  id,
  title,
  price,
  quantity,
  productId,
  defaultImage,
  shortDescription,
  canDelete = true,
  canUpdateQuantity = false,
  setSelectedShippingCosts,
}: CartItem) => {
  const { toggleDialogVisibility } = useAuthDialogStore();
  const { addItemToCart } = useCartActions();
  const { isFetchingItems } = useCartState();

  const [updatingCartItems, setUpdatingCartItems] = useState(false);

  return (
    <div className="relative my-[12px] px-[15px] py-[15px] sm:px-[20px] sm:py-[29px] rounded-[10px] bg-[#393939]/90">
      <div className="flex gap-4 w-full">
        <img
          alt=""
          width={100}
          height={100}
          src={defaultImage || posterImage}
          className="w-[100px] h-[100px] rounded-[10px] object-cover"
        />

        <div className="flex flex-col justify-between w-full gap-4">
          <div className="">
            <p
              title={title}
              className="text-[16px] sm:text-[18px] font-bold leading-[22px] text-[#EDE8E7]"
            >
              {title}
            </p>
            <p
              title={shortDescription}
              className="text-[18px] font-normal leading-[22px] mt-1 text-[#C5B6B3]"
            >
              {shortDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex flex-row items-center gap-2">
              <p className="text-[16px] sm:text-[18px] font-bold leading-[22px] text-[#EDE8E7]">
                Quantity:
              </p>

              {canUpdateQuantity ? (
                <>
                  <button
                    disabled={isFetchingItems}
                    onClick={() =>
                      Number(quantity) > 1 ? addItemToCart(Number(productId), -1) : null
                    }
                    className={`flex items-center justify-center w-[20px] h-[20px] p-0 bg-[#EF6A3B] rounded-[100px] ${
                      Number(quantity) <= 1
                        ? 'opacity-50 hover:opacity-50'
                        : 'hover:opacity-90'
                    }`}
                  >
                    <SubtractIcon />
                  </button>

                  <p className="text-[16px] sm:text-[18px] font-normal leading-[22px] ml-1 text-[#EDE8E7]">
                    {quantity}
                  </p>

                  <button
                    disabled={isFetchingItems}
                    onClick={() => addItemToCart(Number(productId), 1)}
                    className={`flex items-center justify-center w-[20px] h-[20px] p-0 bg-[#EF6A3B] rounded-[100px] hover:opacity-90 `}
                  >
                    <PlusIcon />
                  </button>
                </>
              ) : (
                <p className="text-[16px] sm:text-[18px] font-normal leading-[22px] ml-1 text-[#EDE8E7]">
                  {quantity}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          {canDelete && (
            <div className="flex justify-end cursor-pointer">
              <span
                onClick={() =>
                  toggleDialogVisibility(
                    true,
                    <DeleteCartPopup
                      id={id}
                      productId={productId}
                      quantity={quantity}
                      setSelectedShippingCosts={setSelectedShippingCosts}
                    />,
                    'rounded-[10px]',
                    false
                  )
                }
              >
                <SvgTrashIcon fill="#C5B6B3" />
              </span>
            </div>
          )}
          <div className="">
            <p className="text-[16px] sm:text-[18px] font-bold leading-[22px] text-[#EDE8E7]">{`$${price}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteCartPopup = ({
  id,
  productId,
  setSelectedShippingCosts,
}: {
  id: string;
  productId: string;
  quantity: string;
  getCartItems?: (showLoader?: boolean) => void;
  setSelectedShippingCosts?: any;
}) => {
  const navigate = useNavigate();

  const { cartCount, isFetchingItems} = useCartState();
  const { deleteCartItem } = useCartActions();
  const { toggleDialogVisibility } = useAuthDialogStore();

  const handleCloseDialog = () => {
    if (cartCount === 0) {
      navigate('/props?sorting=1');
    }
    toggleDialogVisibility(false, null);
  };

  const removeItemFromCart = (productId: any) => {
    deleteCartItem(id);

    setSelectedShippingCosts?.(
      (prevCosts: { productId: string; cost: number }[]) =>
        prevCosts.filter((entry) => entry.productId !== productId)
    );

    handleCloseDialog()
  };

  return (
    <div>
      <p className="text-[24px] text-center py-10">
        Are you sure you want to delete this item from cart?
      </p>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-16">
        <div className="w-full md:w-auto">
          <button
            disabled={isFetchingItems}
            onClick={handleCloseDialog}
            className="leading-[19px] rounded-[10px] bg-[#676767] border-[#676767] whitespace-nowrap w-full h-[48px] focus:text-white hover:bg-[#676767] hover:text-white hover:opacity-90"
          >
            Cancel
          </button>
        </div>

        <div className="w-full md:w-auto">
          <button
            disabled={isFetchingItems}
            onClick={() => removeItemFromCart(productId)}
            className="leading-[19px] submit rounded-[10px] h-[48px] w-full focus:text-white hover:text-white hover:opacity-90"
          >
            {isFetchingItems ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
