import { create } from 'zustand';
import { request } from '../request';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  title: string;
  price: string;
  stock?: number;
  quantity: string;
  productId: string;
  propCountryId?: string;
  canDelete?: boolean;
  defaultImage: string;
  shippingDetails?: any;
  shortDescription?: string;
  canUpdateQuantity?: boolean;
  setShouldFetchItems?: any;
  setSelectedShippingCosts?: any;
}

type CartState = {
  isInitialized: boolean;
  cartItems: CartItem[];
  isFetchingItems: boolean;
  cartCount: number;
  cartTotal: string;
};

interface CartStore {
  state: CartState;
  actions: {
    updateCartCount: (cartCount: number) => void;
    fetchCartItems: () => Promise<void>;
    resetCartCount: () => void;
    addItemToCart: (productId: number, quantity: number) => void;
    deleteCartItem: (id: string) => void;
  };
}

export const useCartStore = create<CartStore>((set, get) => ({
  state: {
    isInitialized: false,
    cartItems: [],
    isFetchingItems: false,
    cartCount: 0,
    cartTotal: '0',
  },
  actions: {
    fetchCartItems: async () => {
      set((store) => ({
        state: { ...store.state, isFetchingItems: true, isInitialized: true },
      }));

      try {
        const { data } = await request.get('/cart/items');

        set((store) => ({
          state: {
            ...store.state,
            cartTotal: data?.total || 0,
            cartItems: data?.cartItems || [],
            cartCount: data?.cartItems?.length || 0,
          },
        }));
      } catch (err: any) {
        Object.values(err.response?.data?.messages || {}).forEach((message) =>
          toast.error(String(message))
        );
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingItems: false },
        }));
      }
    },

    addItemToCart: async (productId: number, quantity: number) => {
      set((store) => ({
        state: { ...store.state, isFetchingItems: true },
      }));

      try {
        await request.post('/cart/add', {
          product_id: productId,
          quantity: quantity,
        });

        const { actions, state } = get();
        set({
          state: {
            ...state,
            cartCount: state.cartCount + quantity,
          },
        });
        await actions.fetchCartItems();

        toast.success('Item added to cart!');
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          'Error adding item to cart, try again later.';
        toast.error(String(message));
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingItems: false },
        }));
      }
    },

    deleteCartItem: async (id: string) => {
      set((store) => ({
        state: { ...store.state, isFetchingItems: true },
      }));

      try {
        await request.delete(`/cart/remove/${id}`);

        const { actions } = get();
        await actions.fetchCartItems();

        toast.success('Item removed from cart!');
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          'Error deleting item from cart, try again later.';
        toast.error(String(message));
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingItems: false },
        }));
      }
    },

    updateCartCount: (cartCount: number) => {
      set((store) => ({
        state: {
          ...store.state,
          cartCount: cartCount,
        },
      }));
    },

    resetCartCount: () => {
      set((store) => ({
        state: {
          ...store.state,
          cartCount: 0,
          cartItems: [],
        },
      }));
    },
  },
}));

export const useCartState = () => useCartStore((state) => state.state);

export const useCartActions = () => useCartStore((state) => state.actions);
