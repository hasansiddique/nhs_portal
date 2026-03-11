interface PropCartButtonProps {
    showSubmitButton?: boolean;
    showCartButton?: boolean;
    isOrdersPage?: boolean;
    isLoggedIn: boolean;
    itemId: number;
    stock: number;
    handleLogin?: () => any;
}
export declare const PropCartButton: ({ isOrdersPage, showCartButton, showSubmitButton, ...props }: PropCartButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
