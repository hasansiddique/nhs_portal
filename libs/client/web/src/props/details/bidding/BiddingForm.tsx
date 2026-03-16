import { toast } from 'sonner';
import { toNumber } from 'lodash';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import {request, usePropActions, usePropState} from '@your-props/client/utils';

import 'react-tabs/style/react-tabs.css';
import { Input, Tooltip } from '@your-props/client/ui';
import {
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { PlusIcon, SubtractIcon, SvgInfoIcon } from '@your-props/client/icons';
import { BiddingTimer } from "./BiddingTimer";
import {Spinner} from '@your-props/client/ui';

export const BiddingForm = ({
  setBiddingSubmitted,
}: {
  setBiddingSubmitted: Dispatch<SetStateAction<boolean>>;
}) => {

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [biddIncrementSettings, setBiddIncrementSettings] = useState<any[]>([]);
  const [minBidAmount, setMinBidAmount] = useState<number>(0);
  const [ghostBidAmount, setGhostBidAmount] = useState<number>(0);

  const { updateUserBid } = usePropActions();
  const { prop, auctionLiveBidUpdates } = usePropState();

  const bidThreshold = toNumber(prop?.auctionsDetails?.auction?.minIncrementValue);

  useEffect(() => {
    const bidIncrementSettings = async () => {
      try {
        const { data } = await request.get('/bids-settings');
        setBiddIncrementSettings(data?.settings || []);
        setIsLoadingSettings(false);
      } catch (err: any) {
        toast.error('An error occurred while fetching bid settings.');
      }
    };

    bidIncrementSettings();
  }, []);

  const getIncrement = useCallback(
    (amount: number): number => {
      if (!biddIncrementSettings.length) return bidThreshold || 1;
      const setting = biddIncrementSettings.find(
        (s: any) => amount >= toNumber(s.minPrice) && amount <= toNumber(s.maxPrice)
      );
      return setting ? toNumber(setting.increment) : bidThreshold || 1;
    },
    [biddIncrementSettings, bidThreshold]
  );

  useEffect(() => {
    const calculatedMinBid = prop?.auctionsDetails?.highestBid && prop.auctionsDetails.highestBid !== '0'
        ? prop.auctionsDetails.highestBid + getIncrement(prop.auctionsDetails.highestBid)
        : prop?.auctionsDetails?.auction?.startingPrice || '';

    const ghostBid = prop?.auctionsDetails?.userSecretBid && prop?.auctionsDetails?.userSecretBid > prop?.auctionsDetails?.highestBid ? prop?.auctionsDetails?.userSecretBid : null;

    setGhostBidAmount(ghostBid)
    setMinBidAmount(calculatedMinBid);

    if (auctionLiveBidUpdates > 0) {
      setIsLoadingSettings(true);

      const preventBid = setTimeout(() => {
        setIsLoadingSettings(false);
      }, 2000);

      return () => {
        clearTimeout(preventBid);
      };
    }
  }, [getIncrement, auctionLiveBidUpdates]);


  const [biddingAmount, setBiddingAmount] = useState<number>(0);

  useEffect(() => {
    if (minBidAmount !== 0) {
      if(ghostBidAmount) {
        setBiddingAmount(ghostBidAmount);
      } else {
        setBiddingAmount(minBidAmount);
      }
    }
  }, [minBidAmount]);

  const handleBidChange = (value: number | null) => {
    let minValue = minBidAmount;

    if (ghostBidAmount) {
      minValue = ghostBidAmount;
    }

    const safeValue = value ?? minValue;
    setBiddingAmount(safeValue < minValue ? minValue : safeValue);
  };

  const updateBiddingData = async () => {
    setIsLoading(true);

    try {
      const { data } = await request.post(`/bid/place`, {
        auction_id: prop?.auctionsDetails?.auction?.id,
        bid_price: biddingAmount
      });

      setBiddingSubmitted(true);

      updateUserBid(data?.userHighestBid, data?.userSecretBid);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place bid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSecretMaxBid =
    minBidAmount < biddingAmount ||
    ghostBidAmount >= minBidAmount ||
    (prop?.auctionsDetails.highestBid && prop?.auctionsDetails.highestBid === prop?.auctionsDetails.userHighestBid);

  return (
    <>
      <h2 className="text-white text-[28px] leading-[44px] font-bold justify-center flex mb-5">
        Place a Bid
      </h2>
      <h3 className="text-[20px] leading-[28px] text-[#C5B6B3] font-normal justify-center flex">
        <BiddingTimer inline={true} auction={prop?.auctionsDetails?.auction} />
      </h3>


      <div className="py-[26px]">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between w-full my-[8px]">
            <p className="text-[18px] leading-[28px] text-[#C5B6B3] font-normal">
              {prop?.auctionsDetails.highestBid && prop?.auctionsDetails.highestBid !== '0' ? 'Current Bid' : 'Starting Bid'}
            </p>

            <p className="text-[18px] leading-[28px] text-white font-extrabold">
              {(prop?.auctionsDetails.highestBid && prop?.auctionsDetails.highestBid !== '0' ? `$${prop?.auctionsDetails.highestBid}` : `$${prop?.auctionsDetails.auction.startingPrice}`)}
            </p>
          </div>

          {!isLoadingSettings && (
            <>
              {prop?.auctionsDetails.highestBid && prop?.auctionsDetails.highestBid !== '0' && (
                <div className="flex flex-row justify-between w-full my-[8px]">
                  <p className="text-[18px] leading-[28px] text-[#C5B6B3] font-normal">
                    Next Minimum Bid
                  </p>
                  <p className="text-[18px] leading-[28px] text-white font-extrabold">
                    ${minBidAmount}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between w-full my-[8px]">
                <div className="text-[18px] text-[#C5B6B3] font-normal flex items-center flex-grow">
                  <div className="flex items-center mb-4 sm:!mb-0">
                    {isSecretMaxBid ?  'Your (Secret Maximum) Bid' : 'Your Bid'}

                    {isSecretMaxBid && (
                      <span className="cursor-pointer ml-2">
                        <TooltipProvider delayDuration={0}>
                          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                            <TooltipTrigger asChild>
                              <span
                                aria-label="Info"
                                onClick={() => setTooltipOpen((prev) => !prev)}
                              >
                                <SvgInfoIcon/>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="border border-[#C5B6B3] w-auto rounded-[4px] bg-[#393939] p-0 max-w-[100vw]"
                              align="center"
                            >
                              <p
                                className={
                                  'py-[10px] px-[15px] text-[14px] leading-[20px] text-[#C5B6B3] font-normal whitespace-break-spaces max-w-[550px]'
                                }
                              >
                                There are two ways to place a bid on an item:<br/><br/>
                                A) You can place a bid for the next possible minimum amount ("Your Bid"), which will be executed instantly, <br />or<br/>
                                B) You can set a "Secret Maximum Bid," which will remain confidential. This bid will automatically increase incrementally to the lowest possible amount necessary to outbid competing bids, up to your secret maximum.<br/><br/>

                                Please note that other bidders may also place secret maximum bids. This could result in your bid being instantly outbid, matched, or surpassed, depending on their bid amounts and timing. If two identical secret maximum bids are placed by different bidders, the bid that was placed first will take priority as the leading bid. You can always raise your secret maximum bid at any time during the auction.
                                If you are outbid, you will also have the opportunity to increase your bid at any time until the lot is sold.
                              </p>
                              <TooltipArrow
                                className="TooltipArrow"
                                fill="#393939E5"
                                width={20}
                                height={12}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[18px] leading-[28px] text-white font-extrabold flex">
                  <button
                    className="px-4 py-2 h-[48px] rounded-xl rounded-r-none bg-[#393939] border-[#8a8aa04d] border-r-0 focus:text-white hover:text-white hover:opacity-90"
                    onClick={() => handleBidChange(biddingAmount - getIncrement(biddingAmount))}
                  >
                    <SubtractIcon/>
                  </button>
                  <Input
                    onChange={(e) => handleBidChange(toNumber(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Amount"
                    className="h-[48px] !rounded-none text-center !text-[20px] w-full sm:!w-[150px] hover:border-[#8a8aa04d]"
                    value={biddingAmount.toString() || ''}
                    step={getIncrement(biddingAmount)}
                    type="number"
                    prefix='$'
                    inputMode="numeric"
                  />
                  <button
                    className="px-4 py-2 h-[48px] rounded-xl rounded-l-none bg-[#393939] border-[#8a8aa04d] border-l-0 focus:text-white hover:text-white hover:opacity-90"
                    onClick={() => handleBidChange((biddingAmount || 0) + getIncrement(biddingAmount || 0))}
                  >
                    <PlusIcon/>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={updateBiddingData}
        disabled={isLoadingSettings || isLoading || biddingAmount === 0 || minBidAmount === 0 || biddingAmount < minBidAmount || (ghostBidAmount !== null && biddingAmount <= ghostBidAmount)}
        className="h-[52px] py-0 w-full submit rounded-[10px] border-0 focus:text-white hover:text-white hover:opacity-90 disabled:opacity-50"
      >
        {isLoadingSettings || isLoading ? (
          <Spinner loadingText="Please wait..." />
        ) : (
          <>Bid ${biddingAmount} Now</>
        )}
      </button>

    </>
  );
};
