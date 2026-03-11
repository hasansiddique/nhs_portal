import { toast } from 'sonner';
import React, { useEffect } from 'react';

import { request } from '@your-props/client/utils';
import { useHomepageStore } from '@your-props/client/utils';

import { TopSlider } from './partials/TopSlider';
import { TodayPicks } from './partials/TodayPicks';
import { TopUsersSection } from './partials/TopUsers';
import { FeaturedProps } from './partials/FeaturedProps';
import { TrendingProps } from './partials/TrendingProps';
import { NewestCostumes } from './partials/NewestCostumes';
import { CreateSellSection } from './partials/CreateSellSection';
import { AllCategoryProps } from './partials/AllCategoriesProps';
import { FeaturedCollection } from './partials/FeaturedCollection';
import { FeaturedCollectors } from './partials/FeaturedCollectors';

export const Homepage = () => {
  const setHomepageData = useHomepageStore((state) => state.setHomepageData);
  const setLoadingPageData = useHomepageStore(
    (state) => state.setLoadingPageData
  );
  const resetHomepageData = useHomepageStore(
    (state) => state.resetHomepageData
  );
  const homepageData = useHomepageStore((state) => state.homepageData);

  useEffect(() => {
    getDataFromApi();
  }, []);

  const getDataFromApi = async () => {
    setLoadingPageData(true);
    try {
      const { data } = await request.get('/homepage');
      setHomepageData(data?.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoadingPageData(false);
    }
  };

  return (
    <>
      <div className="home-5">
        <TopSlider
          trendingPropsCostumes={homepageData?.trendingProductsCostumes}
          newestProducts={homepageData?.newestProducts}
          todayPick={homepageData?.todayPick}
          featuredProducts={homepageData?.featuredProducts}
        />
      </div>

      <section className="tf-section live-auctions featured-props-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="flex flex-wrap justify-center gap-4 py-6 rounded-md w-full">
              {homepageData?.navigation.map(
                (item: { link: string; name: string }, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="text-2xl fl-button font-semibold h-[40px] px-[20px] leading-[38px] rounded-[8px] text-white hover:text-white hover:bg-[#676767] transition duration-300 ease-in-out"
                  >
                    {item.name}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {homepageData?.featuredProducts?.length > 0 && (
        <div id="newest-originals">
          <FeaturedProps featuredProducts={homepageData?.featuredProducts} />
        </div>
      )}

      {homepageData?.newestCostumes?.length > 0 && (
        <div id="costumes">
          <NewestCostumes newestCostumes={homepageData?.newestCostumes} />
        </div>
      )}

      {homepageData?.categories?.length > 0 && (
        <div id="categories">
          <AllCategoryProps categories={homepageData?.categories} />
        </div>
      )}

      {homepageData?.trendingProductsCostumes?.length > 0 && (
        <div id="trending">
          <TrendingProps
            trendingPropsCostumes={homepageData?.trendingProductsCostumes}
          />
        </div>
      )}

      {homepageData?.topUsers?.length > 0 && (
        <div className="home-2" id="top-users">
          <TopUsersSection topUsers={homepageData?.topUsers} />
        </div>
      )}

      {homepageData?.featuredCollectors?.length > 0 && (
        <div id="featured-collection">
          <FeaturedCollectors
            featuredCollectors={homepageData?.featuredCollectors}
          />
        </div>
      )}

      {homepageData?.todayPick?.length > 0 && (
        <div id="today-picks">
          <TodayPicks todayPick={homepageData?.todayPick} />
        </div>
      )}

      {homepageData?.featuredCollections?.length > 0 && (
        <div id="featured-collection">
          <FeaturedCollection
            featuredCollections={homepageData?.featuredCollections}
          />
        </div>
      )}

      {homepageData?.featuredProducts?.length > 0 && (
        <div id="featured">
          <FeaturedProps featuredProducts={homepageData?.featuredProducts} />
        </div>
      )}

      <CreateSellSection />
    </>
  );
};
