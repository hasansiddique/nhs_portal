import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import defaultProfileImage from '../../theme/assets/images/avatar/user-img.png';
import { PlusIcon, SubtractIcon } from '@your-props/client/icons';
import { request, useAuthDialogStore } from '@your-props/client/utils';
import { toast } from 'sonner';
import { SpinnerSm } from '@your-props/client/ui';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { SignIn } from '../../auth/SignIn';

interface UserProps {
  id: string;
  avatar: string;
  username: string;
  productCount: number;
}

export const TopUsersSection = ({ topUsers }: { topUsers: UserProps[] }) => {
  const { toggleDialogVisibility } = useAuthDialogStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [followersList, setFollowersList] = useState<{ id: string }[]>([]);

  const user = JSON.parse(localStorage.getItem('user') as string);
  const userId = user?.id;

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  useEffect(() => {
    if (isLoggedIn) getFollowersList();
  }, [isLoggedIn]);

  const getFollowersList = async () => {
    try {
      const { data } = await request.post('/followings', {});
      if (data.status !== false) {
        setFollowersList(data?.data ?? []);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'An error occurred');
    }
  };

  const followersSet = new Set(followersList.map((follower) => follower.id));

  const handleFollowUser = async (userId: string) => {
    if (loadingId) return;

    const prevFollowersList = [...followersList];

    setFollowersList((prev) => [...prev, { id: userId }]);
    setLoadingId(userId);

    try {
      const { data } = await request.post(`/follow`, {
        following_id: userId,
      });
      toast.success('User followed successfully.');
    } catch (err: any) {
      setFollowersList(prevFollowersList);
      toast.error(err.response.data.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnfollowUser = async (id: string) => {
    if (loadingId) return;

    const prevFollowersList = [...followersList];

    setFollowersList((prev) => prev.filter((follower) => follower.id !== id));
    setLoadingId(id);

    try {
      const { data } = await request.post(`/follow/remove`, {
        following_id: id,
      });
      toast.success('User unfollowed successfully.');
    } catch (err: any) {
      setFollowersList(prevFollowersList);
      toast.error(err.response.data.message);
    } finally {
      setLoadingId(null);
    }
  };


  return (
    <section className="tf-section top-seller how-it-works-section bg-[#393939]">
      <div className="py-28">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-live-auctions">
                <h2 className="tf-title mb-25">Top Users</h2>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tf-box">
                {topUsers?.map((item: UserProps, index: number) => (
                  <div
                    key={index}
                    className={`box-item`}
                  >
                    <div className="sc-author-box style-3 pd-0">
                      <div className="author-avatar">
                        <Link
                          to={`/user/${item.id}/details`}
                          className="hover:text-inherit"
                        >
                          <div
                            className={`rounded-[10px] ${
                              item.avatar ? '' : 'bg-[#303030]'
                            }`}
                          >
                            <img
                              src={item.avatar || defaultProfileImage}
                              alt="axies"
                              className={`avatar  !w-[74px] !h-[74px] !rounded-[10px] ${
                                item.avatar
                                  ? 'object-cover'
                                  : 'object-contain p-[10px]'
                              }`}
                            />
                          </div>
                        </Link>

                        {userId !== item.id && (
                          <div
                            className="badge !flex items-center justify-center cursor-pointer"
                            onClick={() => {
                              if (isLoggedIn) {
                                if (followersSet.has(item.id)) {
                                  handleUnfollowUser(item.id).then();
                                } else handleFollowUser(item.id).then();
                              } else {
                                toggleDialogVisibility(true, <SignIn />);
                              }
                            }}
                          >
                            {followersSet.has(item.id) ? (
                              <SubtractIcon />
                            ) : (
                              <PlusIcon />
                            )}
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/user/${item.id}/details`}
                        className="hover:text-inherit"
                      >
                        <div className="author-infor">
                          <h5 className="fs-16">{`${item.username}`}</h5>
                          <span className="price">
                            {item.productCount}{' '}
                            {item.productCount <= 1 ? 'Prop' : 'Props'}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
