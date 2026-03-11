import { default as React } from 'react';

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
export declare const getItemPriceString: (price: any) => string;
export declare const PropListCard: ({ ...props }: CardProps) => import("react/jsx-runtime").JSX.Element;
export declare const PropCard: ({ ...props }: CardProps) => import("react/jsx-runtime").JSX.Element;
export {};
