import React from 'react';
import { useParams } from 'react-router-dom';

export const ProfileSkeleton = () => {
  const params = useParams();
  const currentSelectedUser = params.id;
  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const userId = currentUser?.id as string;

  return (
    <section className="tf-section featured-props-section pb-0 animate-pulse">
      <div className="themesflat-container">
        <div className="rounded-3xl p-[30px] pb-0 profile-detail-section">
          <div className="flex column gap-14">
            <div className="rounded-3xl profile-img mb-[38px] bg-gray-500"></div>

            <div className="w-full flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="flex-grow pt-2">
                  <div className="h-14 w-[180px] bg-gray-500 rounded-xl mb-4"></div>
                  <div className="h-8 w-full max-w-[500px] bg-gray-500 rounded-xl mb-3"></div>
                  <div className="h-8 w-full max-w-[200px] bg-gray-500 rounded-xl mb-4"></div>
                  <div className="h-8 w-full max-w-[300px] bg-gray-500 rounded-xl mb-4"></div>
                </div>
                <div className="flex gap-4">
                  {currentSelectedUser !== userId && (
                    <div className="w-[115px] h-[46px] rounded-2xl bg-gray-500"></div>
                  )}
                  <div className="w-[118px] h-[46px] rounded-2xl bg-gray-500"></div>
                </div>
              </div>
              <div className="flex pb-[18px] gap-10">
                <div className="w-[100px] h-[40px] rounded-2xl bg-gray-500"></div>
                <div className="w-[100px] h-[40px] rounded-2xl bg-gray-500"></div>
                <div className="w-[160px] h-[40px] rounded-2xl bg-gray-500"></div>
                <div className="w-[80px] h-[40px] rounded-2xl bg-gray-500"></div>

                <div className="w-[136px] h-[40px] rounded-2xl bg-gray-500 ml-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
