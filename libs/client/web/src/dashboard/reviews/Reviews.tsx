import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { DashboardLayout } from '../Dashboard';

import defaultProfileImage from '../../theme/assets/images/avatar/user-img.png';
import profileImage from '../../theme/assets/images/avatar/user-img.png';

export const ReviewsPage = () => {
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
      label: 'Reviews',
      isActive: true,
    },
  ];

  const tableColumns = [
    'Name',
    'Movie/Tv Show',
    'Rating',
    'Review',
    'Date Added',
  ];

  const [data] = useState([
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
    {
      img: defaultProfileImage,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: defaultProfileImage,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
    },
  ]);
  const [visible, setVisible] = useState(6);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 3);
  };

  return (
    <DashboardLayout breadCrumbs={breadCrumbs}>
      <div className="w-full">
        <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
          <div className="table-responsive">
            <table className="table table-custom border-0">
              <thead className="thead-dark">
                <tr className="bg-[#393939] rounded-[8px]">
                  {tableColumns.map((col, index) => (
                    <th scope="col" className="border-0 p-0 table-head" key={index}>
                      <p className="font-bold whitespace-nowrap text-[16px] py-[13px] px-[17px]">
                        {col}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, visible).map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex gap-5 items-center w-max">
                        <img
                          alt="userimg"
                          className="w-[34px] h-[34px] rounded-[10px] default_image"
                          src={profileImage}
                        />
                        <p
                          title="Kathy Pachec"
                          className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                        >
                          Kathy Pacheco
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-5 items-center w-max">
                        <img
                          alt="userimg"
                          className="w-[34px] h-[34px] rounded-[10px] default_image"
                          src={profileImage}
                        />
                        <p
                          title="Kathy Pachec"
                          className="text-[16px] text-truncate w-[12rem] whitespace-nowrap"
                        >
                          Prop Name
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="text-[16px] whitespace-nowrap">4/5</p>
                    </td>
                    <td>
                      <p className="text-[16px] whitespace-nowrap">
                        Fusce volutpat lectus et nisl consectetur finibus. In
                        vitae scelerisque augue, in varius eros. Nunc sapien
                        diam, euismod et pretium id,
                      </p>
                    </td>
                    <td>
                      <p className="text-[16px] whitespace-nowrap">
                        Sep 27, 2024 7:35 am
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visible < data.length && (
            <div className="col-md-12 wrap-inner load-more text-center">
              <Link
                to="#"
                id="load-more"
                className="sc-button loadmore fl-button pri-3"
                onClick={showMoreItems}
              >
                Load More
              </Link>
            </div>
          )}
        </div>

        {/* old code -- remove if not required */}
        {/* <div className="row">
          <div className="col-md-12">
            <div className="bg-[#3939394D] rounded-[8px] p-[26px]">
              <div className="table-ranking">
                <div className="flex th-title bg-[#393939] p-[17px] rounded-[8px]">
                  {tableColumns.map((col, index) => (
                    <div className={`${index === 0 ? 'w-auto' : 'column'}`}>
                      <p className="font-bold text-[16px]">{col}</p>
                    </div>
                  ))}
                </div>

                {data.slice(0, visible).map((item, index) => (
                  <div key={index} className="fl-item2">
                    <div className="item item-custom flex">
                      <div className="column">
                        <p className="text-[16px]">Kathy Pacheco</p>
                      </div>

                      <div className="column td2">
                        <p className="text-[16px]">Prop Name</p>
                      </div>

                      <div className="column td3">
                        <p className="text-[16px]">4/5</p>
                      </div>

                      <div className="column td4">
                        <p className="text-[16px]">
                          Fusce volutpat lectus et nisl consectetur finibus. In
                          vitae scelerisque augue, in varius eros. Nunc sapien
                          diam, euismod et pretium id,
                        </p>
                      </div>

                      <div className="column td5">
                        <p className="text-[16px]">Sep 27, 2024 7:35 am</p>
                      </div>
                    </div>

                    <div className="item-border-b" />
                  </div>
                ))}

                {visible < data.length && (
                  <div className="col-md-12 wrap-inner load-more text-center">
                    <Link
                      to="#"
                      id="load-more"
                      className="sc-button loadmore fl-button pri-3"
                      onClick={showMoreItems}
                    >
                      Load More
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};
