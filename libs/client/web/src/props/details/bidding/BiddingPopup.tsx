import React, { useState } from 'react';

import { BiddingForm } from './BiddingForm';
import { BidSubmitted } from './BidSubmitted';

export const BiddingPopup = () => {
  const [biddingSubmitted, setBiddingSubmitted] = useState(false);

  return (
    <div className="modal-body p-0">
      {biddingSubmitted ? (
        <BidSubmitted />
      ) : (
        <BiddingForm
          setBiddingSubmitted={setBiddingSubmitted}
        />
      )}
    </div>
  );
};
