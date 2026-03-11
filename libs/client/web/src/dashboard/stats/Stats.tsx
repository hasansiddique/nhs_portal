import { toast } from 'sonner';
import { toNumber } from 'lodash';
import React, { useEffect, useState } from 'react';

import { NoContentPage, PropCard, Spinner } from '@your-props/client/ui';
import { request } from '@your-props/client/utils';

import { CardProps } from '../../homepage/hompage-props';

import img1 from '../../theme/assets/images/box-item/image-box-47.jpg';
import { DashboardLayout } from '../Dashboard';

export const DashboardStatsPage = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') as string);

  useEffect(() => {
    getPropsList();
  }, []);

  const [propsList, setPropsList] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);

  const getPropsList = async () => {
    setLoadingProps(true);

    try {
      const { data } = await request.post('/props', {
        user_id: currentUser?.id,
      });
      setPropsList(data?.data?.products);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingProps(false);
    }
  };

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
      label: 'Props',
      isActive: true,
    },
  ];

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        {loadingProps ? (
          <div className="flex justify-center items-center my-60 w-full">
            <Spinner
              loadingText="Loading..."
              className="text-primary text-[32px]"
            />
          </div>
        ) : propsList?.length > 0 ? (
          <section className="tf-section today-pick featured-props-section mt-0 pt-0">
            <div className="themesflat-container">
              <div className="row">
                {propsList?.map((item: CardProps, index) => (
                  <div
                    key={index}
                    className="fl-item col-xl-4 col-lg-4 col-md-6 col-sm-6"
                  >
                    <PropCard
                      featureTag={{
                        text: 'screen-matched',
                        show: item?.isOriginal === '1',
                      }}
                      item={{
                        ...item,
                        image: item.imagePath || img1,
                        subTitle: item?.movieName,
                      }}
                      wishlist={{
                        show: true,
                        count: toNumber(item?.productLikes),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <NoContentPage subText="No props found" />
        )}
      </div>
    </DashboardLayout>
  );
};
