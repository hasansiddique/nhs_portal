import { useState } from 'react';
import { Breadcrumbs } from '@your-props/client/ui';
import { ShippingForm } from './ShippingForm';
import { CartContent } from './side-panel/CartContent';

export const CheckoutPage = () => {
  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'Dashboard',
      isActive: false,
      redirectUrl: '/dashboard/props',
    },
    {
      label: 'Checkout',
      isActive: true,
    },
  ];

  const [selectedShippingCosts, setSelectedShippingCosts] = useState<
    { productId: string; cost: number }[]
  >([]);

  const totalShippingCost = selectedShippingCosts.reduce(
    (acc, curr) => acc + curr.cost,
    0
  );

  return (
    <div>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      <section className="tf-section featured-props-section pt-[20px] lg:pt-[30px]">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-lg-7">
              <div className="bg-[#393939]/40 px-[15px] sm:px-[30px] py-[40px] rounded-[10px]">
                <ShippingForm
                  setSelectedShippingCosts={setSelectedShippingCosts}
                />
              </div>
            </div>

            <div className="col-lg-5 mt-[1rem] sm:mt-0">
              <div className="bg-[#393939]/40 px-[15px] sm:px-[30px] py-[40px] rounded-[10px] h-full">
                <CartContent
                  showButton={false}
                  totalShippingCost={totalShippingCost}
                  setSelectedShippingCosts={setSelectedShippingCosts}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
