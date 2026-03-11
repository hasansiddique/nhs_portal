type PropDetails = {
    isAuction: boolean;
    productComments: Array<Array<{
        id: string;
        userId: string;
        comment: string;
        createdAt: string;
        userAvatar: string;
        userUsername: string;
    }>>;
    images: Array<{
        imageBig: string;
        imageSmall: string;
    }>;
    details: {
        title: string;
        description: string;
        shortDescription: string;
    };
    product: {
        characterName: string | undefined;
        id: string;
        coa: string;
        slug: string;
        stock: string;
        movieId: string;
        movieName: string;
        listingType: string;
        price: string;
        currency: string;
        categoryName: string;
        categoryId: string;
        productType: string;
        actorName: string;
        userId: string;
        bidsCount: string;
        currentBid: string;
    };
    vendorProducts: any[];
    auctionsDetails: {
        auction: {
            id: string;
            startTime: string;
            endTime: string;
            status: string;
            startTimeLocal: string;
            endTimeLocal: string;
            startingPrice: number;
            minIncrementValue: string;
        };
        bids: any[];
        userSecretBid: any | null;
        userHighestBid: any | null;
        highestBid: any | null;
    };
    vendorDetails: {
        id: string;
        avatar: string;
        displayName: string;
        username: string;
        averageRating: string;
        totalSold: string;
    };
};
type Bid = {
    id: string;
    auction_id: string;
    bid_price: string;
    bid_time: string;
    user_id: string;
};
type PropState = {
    isInitialized: boolean;
    isFetchingProp: boolean;
    isAddingComment: boolean;
    auctionId: string;
    auctionLiveBidUpdates: number;
    prop: PropDetails | null;
    isOffers: boolean;
};
interface PropStore {
    state: PropState;
    actions: {
        fetchProp: (propId: string) => Promise<boolean>;
        reFetchProp: () => Promise<void>;
        addComment: (propId: string, commentData: string) => Promise<void>;
        checkOffers: (productId: string) => Promise<void>;
        updateAuctionBids: (bidData: {
            prop_id: any;
            bid: Bid;
            highest_bid: any;
            userHighestBid: any;
        }) => void;
        updateUserBid: (userHighestBid: number, userSecretBid: number) => void;
    };
}
export declare const usePropStore: import('zustand').UseBoundStore<import('zustand').StoreApi<PropStore>>;
export declare const usePropState: () => PropState;
export declare const usePropActions: () => {
    fetchProp: (propId: string) => Promise<boolean>;
    reFetchProp: () => Promise<void>;
    addComment: (propId: string, commentData: string) => Promise<void>;
    checkOffers: (productId: string) => Promise<void>;
    updateAuctionBids: (bidData: {
        prop_id: any;
        bid: Bid;
        highest_bid: any;
        userHighestBid: any;
    }) => void;
    updateUserBid: (userHighestBid: number, userSecretBid: number) => void;
};
export {};
