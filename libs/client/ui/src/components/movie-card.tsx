import React from 'react';

export interface MovieProps {
  id: string;
  name: string;
  title: string;
  imgleft: string;
  wishlist: number;
  imgAuthor: string;
  imgright1: string;
  imgright2: string;
  imgright3: string;
  totalLikes: number;
  totalImages: number;
}

export const MovieGridCard = ({
  item,
  redirectLink,
}: {
  item: MovieProps;
  redirectLink: string;
}) => {
  return (
    <>
      {/* <Link to={redirectLink}>{item.title}</Link> */}
      <div className="sc-card-collection style-2 !mb-[30px]">
        <div className="flex justify-between items-start w-full gap-5">
          <img
            src={item.imgAuthor}
            alt={item.title || 'Movie'}
            className="rounded-[10px] w-[50px] h-[50px] object-cover flex-shrink-0"
          />

          <div className="overflow-hidden flex-grow">
            <h4 title={item.title} className="max-w-[300px] font-bold text-[20px] leading-[28px] text-[#EDE8E7] text-truncate transition">
              {item.title}
            </h4>

            <p className="text-[18px] text-[#C5B6B3]">{item.name}</p>
          </div>
          <div className="wishlist-button public heart bg-[#222222] mt-2 flex-shrink-0">
            <span className="font-bold text-[14px]">{item.totalLikes}</span>
          </div>
        </div>

        {item.totalImages === 1 ? (
          <div className="media-images-collection">
            <div className="box-left m-0 !w-full">
              <img src={item.imgright1} alt="Axies" />
            </div>
          </div>
        ) : item.totalImages === 2 ? (
          <div className="media-images-collection">
            <div className="box-left">
              <img src={item.imgright1} alt="Axies" />
            </div>

            <div className="box-left m-0">
              <img src={item.imgright2} alt="Axies" />
            </div>
          </div>
        ) : item.totalImages === 3 ? (
          <div className="media-images-collection">
            <div className="box-left">
              <img src={item.imgright1} alt="Axies" />
            </div>

            <div className="box-right">
              <div className="mb-[10px] w-full">
                <img
                  src={item.imgright2}
                  alt="Axies"
                  className="w-full h-[100px]"
                />
              </div>
              <div className="bottom-img">
                <img src={item.imgright3} alt="Axies" />
              </div>
            </div>
          </div>
        ) : (
          <div className="media-images-collection">
            <div className="box-left">
              <img src={item.imgleft} alt="Axies" />
            </div>

            <div className="box-right">
              <div className="top-img">
                <img src={item.imgright1} alt="Axies" />
                <img src={item.imgright2} alt="Axies" />
              </div>
              <div className="bottom-img">
                <img src={item.imgright3} alt="Axies" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const MovieListCard = ({
  item,
  redirectLink,
}: {
  item: MovieProps;
  redirectLink: string;
}) => {
  return (
    <>
      {/* <Link to={redirectLink}>{item.title}</Link> */}
      <div className="sc-card-collection style-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <img
              src={item.imgAuthor}
              alt="Axies"
              className="ml-[1px] mr-[10px] rounded-[10px] w-[64px] h-[64px] object-cover"
            />

            <div>
              <h4 className="font-bold text-[20px] text-[#EDE8E7] mb-2">
                {item.title}
              </h4>

              <p className="text-[18px] text-[#C5B6B3]">{item.name}</p>
            </div>
          </div>
          <div className="wishlist-button public heart bg-[#222222] mt-2">
            <span className="font-bold text-[14px]">{item.totalLikes}</span>
          </div>
        </div>
      </div>
    </>
  );
};
