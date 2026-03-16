import { useState } from 'react';

import { OfferForm } from './OfferForm';
import { OfferSubmitted } from './OfferSubmitted';
import { SvgSuccess } from '@your-props/client/icons';

export const OfferPopup = ({
  productId,
  isPendingOfferExists,
  offerSubmitted,
  setOfferSubmitted
}: {
  productId: string;
  isPendingOfferExists?: any;
  offerSubmitted?: any;
  setOfferSubmitted?: any;
}) => {
  const [isOfferSubmit, setIsOfferSubmit] = useState(false);
  //console.log(isPendingOfferExists)

  return isPendingOfferExists?.status !== 'error' ? (
    <div className="flex flex-col items-center w-full text-center ">
      <div className="w-[68px] h-[68px] rounded-[80px] flex items-center justify-center bg-[#109A2E]/20 mb-6">
        <div className="w-[48px] h-[48px] rounded-[80px] flex items-center justify-center bg-[#109A2E]">
          <SvgSuccess width={29} height={28} />
        </div>
      </div>

      <h5 className="md:whitespace-nowrap text-[25px] mb-[3rem]">
        You have already made an offer to this prop.
      </h5>
      <p>You can make another offer once it is accepted or rejected.</p>

      <p>
        For more information <br /> Please visit{' '}
        <a
          href={'/dashboard/offers'}
          className="font-semibold underline hover:underline"
        >
          Offers
        </a>{' '}
        on your Dashboard
      </p>
    </div>
  ) : (
    <div className="modal-body">
      {isOfferSubmit ? (
        <OfferSubmitted />
      ) : (
        <OfferForm
          productId={productId}
          setOfferSubmitted={setOfferSubmitted}
          setIsOfferSubmit={setIsOfferSubmit}
        />
      )}
    </div>
  );
};
