import React, { useEffect, useState } from "react";
import { ColonIcon } from "@your-props/client/icons";
import { toast } from "sonner";
import { usePropActions } from "@your-props/client/utils";

export const BiddingTimer = ({ auction, inline = false }: { auction: any; inline: boolean }) => {
  const { reFetchProp } = usePropActions();

  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionStatus, setAuctionStatus] = useState<"scheduled" | "starting" | "running" | "ended">("scheduled");

  useEffect(() => {
    const startTimestamp = new Date(auction.startTimeLocal).getTime();
    const endTimestamp = new Date(auction.endTimeLocal).getTime();
    const nowTimestamp = Date.now();

    if (nowTimestamp < startTimestamp) {
      setAuctionStatus("scheduled");
      setTimeLeft(startTimestamp - nowTimestamp);
    } else if (nowTimestamp < endTimestamp) {
      setAuctionStatus("running");
      setTimeLeft(endTimestamp - nowTimestamp);
    } else if(nowTimestamp > endTimestamp) {
      setAuctionStatus("ended");
      setTimeLeft(0);
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timerInterval);

          if(auctionStatus === "scheduled") {
            toast.info("The auction is starting now. Please wait...");
            setAuctionStatus("starting");
          } else {
            toast.info("The auction has now ended. Please wait...");
            setAuctionStatus("ended");
          }

          setTimeout(() => reFetchProp(), 3000);

          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [auction]);

  useEffect(() => {
    // console.log(auctionStatus);
  }, [auctionStatus]);

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  if (inline) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        <div className="flex flex-wrap justify-center gap-[8px]">
          <span className="mx-[4px] text-[#fafafafa]">
            <span className="inline-block w-[24px]">{days}</span> Days
          </span>
          <span className="mx-[4px] text-[#6A6A6A]">:</span>
          <span className="mx-[4px] text-[#fafafafa]">
            <span className="inline-block w-[24px]">{hours}</span> Hours
          </span>
          <span className="mx-[4px] text-[#6A6A6A]">:</span>
          <span className="mx-[4px] text-[#fafafafa]">
            <span className="inline-block w-[24px]">{minutes}</span> Minutes
          </span>
          <span className="mx-[4px] text-[#6A6A6A]">:</span>
          <span className="mx-[4px] text-[#fafafafa]">
            <span className="inline-block w-[24px]">{seconds}</span> Seconds
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-left mb-10">
        <span className="text-[18px] text-[#C5B6B3] leading-[22px] font-normal">
          Auction {auctionStatus === "ended" ? "has ended." : auctionStatus === "running" ? "ends in..." : auctionStatus === "starting" ? "is now starting..." : "starts in..."}
        </span>
      </div>

      <div className="mt-[14px] flex flex-row justify-between">
        {[days, hours, minutes, seconds].map((value, index) => (
          <React.Fragment key={index}>
            <div className="w-full py-[18px] bg-[#222222] rounded-[10px] justify-center items-center flex flex-col">
              <span className="text-[20px] sm:text-[30px] font-bold capitalize">{value}</span>
              <span className="mt-[12px] font-semibold text-[#C5B6B3] text-[16px] sm:text-[18px]">
                {["Days", "Hrs", "Mins", "Secs"][index]}
              </span>
            </div>
            {index < 3 && (
              <div className="px-[10px] sm:px-[18px] items-center flex">
                <ColonIcon />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div
        className="w-full my-[30px] border-b-[1px] border-b-[#C5B6B3]"
        style={{ borderBottom: "0.5px solid #C5B6B3" }}
      />
    </>
  );
};
