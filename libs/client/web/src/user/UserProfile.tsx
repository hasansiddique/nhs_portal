import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { request } from '@your-props/client/utils';
import { Breadcrumbs, PropCard } from '@your-props/client/ui';
import { SvgFollow } from '@your-props/client/icons';

import img1 from '../theme/assets/images/box-item/card-item-3.jpg';
import imga1 from '../theme/assets/images/avatar/avt-1.jpg';
import imgCollection1 from '../theme/assets/images/avatar/avt-18.jpg';
import img2 from '../theme/assets/images/box-item/card-item-4.jpg';
import imga2 from '../theme/assets/images/avatar/avt-2.jpg';
import img3 from '../theme/assets/images/box-item/card-item-2.jpg';
import imga3 from '../theme/assets/images/avatar/avt-4.jpg';
import img4 from '../theme/assets/images/box-item/card-item-7.jpg';
import imga4 from '../theme/assets/images/avatar/avt-3.jpg';
import img5 from '../theme/assets/images/box-item/card-item8.jpg';
import imga5 from '../theme/assets/images/avatar/avt-12.jpg';
import img6 from '../theme/assets/images/box-item/card-item-9.jpg';
import imga6 from '../theme/assets/images/avatar/avt-1.jpg';
import img7 from '../theme/assets/images/box-item/image-box-6.jpg';
import imga7 from '../theme/assets/images/avatar/avt-4.jpg';
import img8 from '../theme/assets/images/box-item/image-box-11.jpg';
import imga8 from '../theme/assets/images/avatar/avt-3.jpg';
import profileImage from '../theme/assets/images/avatar/user-img.png';
import { toNumber } from 'lodash';

const propsListings = [
  {
    id: '1',
    img: img1,
    title: 'The RenaiXance Rising the sun ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga1,
    nameAuthor: 'SalvadorDali',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '2',
    img: img2,
    title: 'Space babe - Night 2/25 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga2,
    nameAuthor: 'Trista Francis',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    feature: 'coming soon',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '3',
    img: img3,
    title: 'CyberPrimal 042 LAN',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga3,
    nameAuthor: 'Freddie Carpenter',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '4',
    img: img4,
    title: 'Crypto Egg Stamp #5 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga4,
    nameAuthor: 'Tyler Covington',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '5',
    img: img5,
    title: 'Travel Monkey Club #45 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga5,
    nameAuthor: 'SalvadorDali',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '6',
    img: img6,
    title: 'Sir. Lion Swag #371 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga6,
    nameAuthor: 'Trista Francis',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '7',
    img: img7,
    title: 'Cyber Doberman #766',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga7,
    nameAuthor: 'Freddie Carpenter',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '8',
    img: img8,
    title: 'Living Vase 01 by Lanz...',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga8,
    nameAuthor: 'Freddie Carpenter',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '9',
    img: img1,
    title: 'The RenaiXance Rising the sun ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga1,
    nameAuthor: 'SalvadorDali',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '10',
    img: img2,
    title: 'Space babe - Night 2/25 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga2,
    nameAuthor: 'Trista Francis',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    feature: 'coming soon',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '11',
    img: img3,
    title: 'CyberPrimal 042 LAN',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga3,
    nameAuthor: 'Freddie Carpenter',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '12',
    img: img4,
    title: 'Crypto Egg Stamp #5 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga4,
    nameAuthor: 'Tyler Covington',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '13',
    img: img5,
    title: 'Travel Monkey Club #45 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga5,
    nameAuthor: 'SalvadorDali',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '14',
    img: img6,
    title: 'Sir. Lion Swag #371 ',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga6,
    nameAuthor: 'Trista Francis',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '15',
    img: img7,
    title: 'Cyber Doberman #766',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga7,
    nameAuthor: 'Freddie Carpenter',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
  {
    id: '16',
    img: img8,
    title: 'Living Vase 01 by Lanz...',
    subTitle: 'Living Vase 01 by Lanz...',
    tags: 'bsc',
    imgAuthor: imga8,
    nameAuthor: 'Freddie Carpenter',
    price: 400,
    priceChange: '$12.246',
    wishlist: '100',
    imgCollection: imgCollection1,
    nameCollection: 'Creative Art 3D',
  },
];

export const UserProfile = () => {
  const breadCrumbs = [
    {
      label: 'Home',
      isActive: false,
      redirectUrl: '/',
    },
    {
      label: 'My Profile',
      isActive: true,
    },
  ];

  useEffect(() => {
    getProfileDetails();
  }, []);

  const params = useParams();
  const loggedInUserId = params.id;

  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    getProfileDetails();
  }, []);

  const getProfileDetails = async () => {
    setFetchingProfile(true);

    try {
      const { data } = await request.get(`/profile/${loggedInUserId}`);
      setProfileData(data?.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setFetchingProfile(false);
    }
  };

  return (
    <>
      <Breadcrumbs breadCrumbs={breadCrumbs} />

      <section className="tf-section featured-props-section pb-0">
        <div className="themesflat-container">
          <div className="row rounded-3xl p-[30px] profile-detail-section">
            <div className="col-md-3">
              <img src={profileImage} alt="user" className="rounded-3xl default_image" />
            </div>
            <div className="col-md-9 flex justify-between items-start">
              <div className="flex flex-col max-w-[60%]">
                <h2 className="leading-[44px]">Trista Francis</h2>
                <div className="mt-[8px]" />
                <p className="leading-[22px]">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Laborum obcaecati dignmos quae quo ad iste ipsum officiis
                  deleniti asperiores sit.
                </p>
              </div>

              <div className="flex flex-row">
                <button className="px-[24px] py-[12px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] hover:text-white hover:border-white disabled:opacity-70 disabled:border-none">
                  <span>Follow</span>
                </button>

                <button className="ml-[10px] p-[12px] rounded-[10px] bg-[#676767] border-[#676767] hover:text-white hover:border-white">
                  <SvgFollow />
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-[-65px] rounded-b-3xl profile-detail-tabs">
            <div className="col-md-3" />
            <div className="col-md-9 flex flex-row">
              <div className="p-[16px] text-[16px] leading-[24px] font-[700] ">
                <div className="hover:bg-[#EF6A3B] px-[14px] py-[8px] hover:cursor-pointer hover:text-white rounded-2xl active:bg-[#EF6A3B]">
                  All Props
                </div>
              </div>
              <div className="p-[16px] text-[16px] leading-[24px] font-[700] ">
                <div className="hover:bg-[#EF6A3B] px-[14px] py-[8px] hover:cursor-pointer hover:text-white rounded-2xl active:bg-[#EF6A3B]">
                  For Sale
                </div>
              </div>
              <div className="p-[16px] text-[16px] leading-[24px] font-[700] ">
                <div className="hover:bg-[#EF6A3B] px-[14px] py-[8px] hover:cursor-pointer hover:text-white rounded-2xl active:bg-[#EF6A3B]">
                  Showcase Only
                </div>
              </div>
              <div className="p-[16px] text-[16px] leading-[24px] font-[700] ">
                <div className="hover:bg-[#EF6A3B] px-[14px] py-[8px] hover:cursor-pointer hover:text-white rounded-2xl active:bg-[#EF6A3B]">
                  Sold
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tf-section today-pick featured-props-section">
        <div className="themesflat-container">
          <div className="row">
            {propsListings.slice(0, visible).map((item: any, index: number) => (
              <div
                key={index}
                className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6"
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

            {visible < propsListings.length && (
              <div className="col-md-12 wrap-inner load-more text-center">
                <Link
                  to="#"
                  id="load-more"
                  className="sc-button loadmore fl-button pri-3 rounded-[10px]"
                  onClick={showMoreItems}
                >
                  <span>Load More</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
