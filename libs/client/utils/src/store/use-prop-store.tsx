import { toast } from 'sonner';
import { create } from 'zustand';
import { request } from '../request';
import { toZonedTime, format } from 'date-fns-tz';
import { getUserId } from "../auth.types";

type PropDetails = {
  isAuction: boolean;
  productComments: Array<
    Array<{
      id: string;
      userId: string;
      comment: string;
      createdAt: string;
      userAvatar: string;
      userUsername: string;
    }>
  >;
  images: Array<{ imageBig: string; imageSmall: string }>;
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

export const usePropStore = create<PropStore>((set, get) => ({
  state: {
    isInitialized: false,
    isFetchingProp: false,
    isAddingComment: false,
    auctionId: '',
    auctionLiveBidUpdates: 0,
    prop: null,
    isOffers: false,
  },
  actions: {
    fetchProp: async (propId) => {
      set((store) => ({
        state: { ...store.state, isFetchingProp: true, isInitialized: true },
      }));

      try {
        const { data } = await request.post(`/prop-details/${propId}`, {});

        const updatedAuction = getUpdatedAuctionData(data.data?.auctionsDetails?.auction);

        set((store) => ({
          state: {
            ...store.state,
            auctionId: updatedAuction?.id || '',
            prop: {
              ...data?.data,
              auctionsDetails: {
                ...data.data.auctionsDetails,
                auction: updatedAuction, // Store updated auction details
              },
            },
          },
        }));

        return true;
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || 'Something went wrong.');

        return false
      } finally {
        set((store) => ({
          state: { ...store.state, isFetchingProp: false },
        }));
      }
    },

    reFetchProp : async () => {
      const { prop } = get().state;
      if (!prop) return;

      const propId = prop.product.slug; // Extract propId from state
      if (!propId) return;

      await get().actions.fetchProp(propId);
    },

    updateAuctionBids: (bidData) => {
      set((store) => {
        const { auctionId, prop } = store.state;
        if (!prop || !auctionId) return store;
        if (auctionId !== bidData.bid?.auction_id) {
          return store;
        }

        const isUserBid = bidData.bid?.user_id === getUserId();

        return {
          state: {
            ...store.state,
            auctionLiveBidUpdates: store.state.auctionLiveBidUpdates + 1,
            prop: {
              ...prop,
              auctionsDetails: {
                ...prop.auctionsDetails,
                bids: [bidData.bid, ...prop.auctionsDetails.bids],
                highestBid: bidData.highest_bid,
                userHighestBid: isUserBid ? bidData.bid.bid_price : prop.auctionsDetails.userHighestBid,
              },
            },
          },
        };
      });
    },

    updateUserBid: (userHighestBid, userSecretBid) => {
      set((store) => {
        const { prop } = store.state;
        if (!prop) return store;

        return {
          state: {
            ...store.state,
            prop: {
              ...prop,
              auctionsDetails: {
                ...prop.auctionsDetails,
                userHighestBid: userHighestBid || prop.auctionsDetails.userHighestBid,
                userSecretBid: userSecretBid || prop.auctionsDetails.userSecretBid,
              },
            },
          },
        };
      });
    },

    addComment: async (propId: string, commentData: string) => {
      if (!commentData.trim()) return;

      set((store) => ({
        state: { ...store.state, isAddingComment: true },
      }));

      try {
        const { data } = await request.post(`/add-comment`, {
          product_id: propId,
          comment: commentData,
        });

        set((store) => {
          const { prop } = store.state;
          if (!prop || propId !== prop.product.id) return store;

          return {
            state: {
              ...store.state,
              prop: {
                ...prop,
                productComments: [
                  [
                    {
                      id: data.data.id,
                      userId: data.data.userId,
                      comment: data.data.comment,
                      createdAt: data.data.createdAt,
                      userAvatar: data.data.userAvatar,
                      userUsername: data.data.userUsername,
                    },
                    ...prop.productComments[0] ?? [],
                  ],
                  ...prop.productComments.slice(1),
                ],
              },
            },
          };
        });
      } catch (err: any) {
        console.log(err)
        toast.error(err.response?.data?.message || err.message || 'Something went wrong.');
      } finally {
        set((store) => ({
          state: { ...store.state, isAddingComment: false },
        }));
      }
    },

    checkOffers: async (productId) => {
      try {
        const { data } = await request.get(`offers-check/${productId}`);

        set((store) => ({
          state: {
            ...store.state,
            isOffers: Boolean(data),
          },
        }));
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to check offers.');
      }
    },
  },
}));

// 🔥 Auction Data Transformation 🔥
const getUpdatedAuctionData = (auction: { startTime: string; endTime: string; id: string; startingPrice: number }) => {
  if (!auction?.startTime || !auction?.endTime) return auction;

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startTimeUTC = new Date(auction.startTime + 'Z');
  const endTimeUTC = new Date(auction.endTime + 'Z');
  const nowUTC = new Date();

  const startTimeLocal = toZonedTime(startTimeUTC, localTimeZone);
  const endTimeLocal = toZonedTime(endTimeUTC, localTimeZone);
  const nowLocal = toZonedTime(nowUTC, localTimeZone);

  let status: string;
  if (nowLocal < startTimeLocal) {
    status = 'scheduled';
  } else if (nowLocal >= startTimeLocal && nowLocal < endTimeLocal) {
    status = 'active';
  } else {
    status = 'ended';
  }

  return {
    ...auction,
    status,
    startTimeLocal: format(startTimeLocal, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: localTimeZone }),
    endTimeLocal: format(endTimeLocal, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: localTimeZone }),
  };
};

// Selectors for accessing state/actions in components
export const usePropState = () => usePropStore((state) => state.state);
export const usePropActions = () => usePropStore((state) => state.actions);
