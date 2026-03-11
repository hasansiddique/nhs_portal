import { useNavigate } from 'react-router-dom';
import { toNumber } from 'lodash';
import { useEffect, useState } from 'react';

import { SvgCartFilled } from '@your-props/client/icons';
import { useCartState, useCartActions } from '@your-props/client/utils';

import { Input } from './input';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';

interface PropCartButtonProps {
  showSubmitButton?: boolean;
  showCartButton?: boolean;
  isOrdersPage?: boolean;
  isLoggedIn: boolean;
  itemId: number;
  stock: number;
  handleLogin?: () => any;
}

export const PropCartButton = ({
  isOrdersPage = false,
  showCartButton = true,
  showSubmitButton = true,
  ...props
}: PropCartButtonProps) => {
  const { isLoggedIn, itemId, stock } = props;

  const [availableStock, setAvailableStock] = useState(stock);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const { addItemToCart } = useCartActions();
  const { cartItems, isFetchingItems } = useCartState();

  const navigate = useNavigate();

  useEffect(() => {
    const cartItem = cartItems.find((item: any) => item.productId == itemId);
    const cartQuantity = cartItem ? parseInt(cartItem.quantity, 10) : 0;

    const calcAvailableStock = stock - cartQuantity;
    setAvailableStock(calcAvailableStock);

    if (calcAvailableStock < 1) {
      setQuantity(0);
    }
  }, [cartItems, stock, itemId]);

  const handleOnCartClick = () => {
    if (isLoggedIn) {
      if (availableStock === 0) {
        toast.error('Item cannot be added to cart, available stock is 0.');
        return;
      } else if (availableStock === 1) {
        setQuantity(1);
        handleAddToCart();
      } else {
        setShowModal(true);
      }
    } else if (props.handleLogin) {
      props.handleLogin();
    }
  };

  const handleQuantityChange = (qty: number) => {
    if (qty > availableStock) {
      qty = availableStock;
    }

    if (qty < 1) {
      qty = 1;
    }

    setQuantity(qty);
  };

  const handleAddToCart = () => {
    addItemToCart(itemId, quantity);
    setAvailableStock((prevStock) => prevStock - quantity);
    setShowModal(false);
    setQuantity(1);
  };

  return (
    <>
      <Modal
        size="sm"
        centered={true}
        show={showModal}
        backdrop="static"
        scrollable={true}
        className="bg-[#393939B2]"
        onHide={() => {
          setShowModal(false);
          setQuantity(1);
        }}
      >
        <Modal.Header
          closeButton
          className="p-0"
          onClick={() => setShowModal(false)}
        ></Modal.Header>

        <div className="modal-body pd-40">
          <h2 className="text-[28px] leading-[44px] font-bold justify-center flex pb-6">
            Quantity
          </h2>

          <div className="w-full mb-[26px] flex justify-between">
            <button
              className="px-4 py-2 h-[48px] rounded-xl rounded-r-none bg-[#393939] border-[#393939] focus:text-white hover:text-white hover:opacity-90 border-[#8a8aa04d] border-r-0"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={availableStock === 0}
            >
              -
            </button>
            <Input
              onChange={(e) => handleQuantityChange(toNumber(e.target.value))}
              max={availableStock}
              placeholder="Quantity"
              className="h-[48px] !rounded-none text-center"
              defaultValue={1}
              value={quantity}
              type="number"
              min={1}
              disabled={availableStock === 0}
            />
            <button
              className="px-4 py-2 h-[48px] rounded-xl rounded-l-none bg-[#393939] border-[#393939] focus:text-white hover:text-white hover:opacity-90 border-[#8a8aa04d] border-l-0"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= availableStock}
            >
              +
            </button>
          </div>
          <p className="text-[14px] pb-4">
            Item(s) remaining in stock:{' '}
            <strong>{availableStock - quantity}</strong>
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full submit rounded-[10px] border-0 focus:text-white hover:text-white hover:opacity-90"
            disabled={isFetchingItems || availableStock === 0}
          >
            Add to Cart
          </button>
        </div>
      </Modal>

      <div className="flex">
        {showSubmitButton && (
          <button
            onClick={() => {
              if (isLoggedIn) {
                handleOnCartClick();
                navigate('/dashboard/checkout');
              } else if (props.handleLogin) {
                props.handleLogin();
              }
            }}
            className={`text-[22px] leading-[22px] font-semibold rounded-[10px] whitespace-nowrap h-[60px] bg-[#EF6A3B] hover:opacity-90 focus:text-white hover:text-white ${
              showCartButton ? ' rounded-r-none' : ''
            }`}
            disabled={isFetchingItems || availableStock === 0}
          >
            Buy Now
          </button>
        )}

        {showCartButton && (
          <button
            onClick={handleOnCartClick}
            className={`${
              isOrdersPage ? 'h-[36px] p-[6px]' : 'h-[60px] p-[12px]'
            } ml-0  rounded-[10px] ${
              showSubmitButton ? 'rounded-l-none' : ''
            } bg-[#C75A33] border-[#C75A33] hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none`}
            disabled={isFetchingItems && !isOrdersPage}
          >
            <SvgCartFilled />
          </button>
        )}
      </div>
    </>
  );
};
