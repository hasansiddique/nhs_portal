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
export declare const useCartStore: import('zustand').UseBoundStore<import('zustand').StoreApi<CartStore>>;
export declare const useCartState: () => CartState;
export declare const useCartActions: () => {
    updateCartCount: (cartCount: number) => void;
    fetchCartItems: () => Promise<void>;
    resetCartCount: () => void;
    addItemToCart: (productId: number, quantity: number) => void;
    deleteCartItem: (id: string) => void;
};
export {};
