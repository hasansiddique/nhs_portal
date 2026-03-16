import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <>
      <div className="flex stats-flex-direction gap-8 mb-[20px]">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col sm:flex-row gap-7">
            <div className=" stat-card">
              <div className="bg-[#393939]/40 p-[24px] rounded-[10px] flex flex-row h-full animate-pulse">
                <div className="w-[54px] h-[56px] rounded-[10px] p-[14px] bg-gray-500"></div>

                <div className="pl-[18px] flex flex-col justify-between w-full">
                  <div className="h-8 w-3/4 bg-gray-500 rounded-xl"></div>
                  <div className="h-8 w-1/4 bg-gray-500 rounded-xl"></div>
                </div>
              </div>
            </div>
            <div className=" stat-card">
              <div className="bg-[#393939]/40 p-[24px] rounded-[10px] flex flex-row h-full animate-pulse">
                <div className="w-[54px] h-[56px] rounded-[10px] p-[14px] bg-gray-500"></div>

                <div className="pl-[18px] flex flex-col justify-between w-full">
                  <div className="h-8 w-3/4 bg-gray-500 rounded-xl"></div>
                  <div className="h-8 w-1/4 bg-gray-500 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-7">
            <div className=" stat-card">
              <div className="bg-[#393939]/40 p-[24px] rounded-[10px] flex flex-row h-full animate-pulse">
                <div className="w-[54px] h-[56px] rounded-[10px] p-[14px] bg-gray-500"></div>

                <div className="pl-[18px] flex flex-col justify-between w-full">
                  <div className="h-8 w-3/4 bg-gray-500 rounded-xl"></div>
                  <div className="h-8 w-1/4 bg-gray-500 rounded-xl"></div>
                </div>
              </div>
            </div>
            <div className=" stat-card">
              <div className="bg-[#393939]/40 p-[24px] rounded-[10px] flex flex-row h-full animate-pulse">
                <div className="w-[54px] h-[56px] rounded-[10px] p-[14px] bg-gray-500"></div>

                <div className="pl-[18px] flex flex-col justify-between w-full">
                  <div className="h-8 w-3/4 bg-gray-500 rounded-xl"></div>
                  <div className="h-8 w-1/4 bg-gray-500 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-8 w-full">
          <div className="bg-[#393939]/40 p-[24px] rounded-[10px] stat-chart-card w-full animate-pulse">
            <div className="flex flex-row justify-between">
              <p className="h-8 w-1/4 bg-gray-500 rounded-xl"></p>
            </div>

            <div className="flex flex-col justify-center items-center h-full">
              <svg
                width="138"
                height="138"
                viewBox="0 0 138 138"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M69 138C107.108 138 138 107.108 138 69C138 30.8923 107.108 0 69 0C30.8923 0 0 30.8923 0 69C0 107.108 30.8923 138 69 138ZM69.0001 130.799C103.132 130.799 130.801 103.13 130.801 68.9987C130.801 34.8673 103.132 7.19824 69.0001 7.19824C34.8686 7.19824 7.19962 34.8673 7.19962 68.9987C7.19962 103.13 34.8686 130.799 69.0001 130.799Z"
                  fill="#6b7280"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          </div>

          <div className="bg-[#393939]/40 p-[24px] rounded-[10px] stat-chart-card w-full animate-pulse">
            <div className="pb-6">
              <p className="h-8 w-1/4 bg-gray-500 rounded-xl"></p>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center h-full">
              <svg
                width="212"
                height="77"
                viewBox="0 0 212 77"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="33" width="17" height="44" rx="4" fill="#6b7280"/>
                <rect x="39" width="17" height="77" rx="4" fill="#6b7280"/>
                <rect x="78" y="22" width="17" height="55" rx="4" fill="#6b7280"/>
                <rect x="117" y="47" width="17" height="30" rx="4" fill="#6b7280"/>
                <rect x="156" y="13" width="17" height="64" rx="4" fill="#6b7280"/>
                <rect x="195" y="47" width="17" height="30" rx="4" fill="#6b7280"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#3939394D] rounded-[8px] p-[26px] animate-pulse">
        <div className="flex wrap justify-between items-center mb-10">
          <h5 className="h-8 w-[100px] bg-gray-500 rounded-xl"></h5>
          <div className="w-[100px] h-[38px] px-[15px] py-[12px] rounded-[10px] bg-[#6b7280]"></div>
        </div>
      </div>
    </>
  );
};
