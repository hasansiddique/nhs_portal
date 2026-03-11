import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';

import { request, useAuthDialogStore } from '@your-props/client/utils';

import { SignIn } from '../../auth/SignIn';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';

export const UserFollow = ({
  isFollowed,
  onComplete,
}: {
  isFollowed: any;
  onComplete: (followed: boolean) => void;
}) => {
  const params = useParams();
  const userToFollowId = params.id;

  const { toggleDialogVisibility } = useAuthDialogStore();

  const [updating, setUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(isFollowed);

  const handleFollowUser = async () => {
    if (updating) return;

    setIsFollowing(true);
    setUpdating(true);

    try {
      await request.post(`/follow`, {
        following_id: userToFollowId,
      });

      onComplete(true);
    } catch (err: any) {
      setIsFollowing(false);
      toast.error(err.response.data.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUnFollowUser = async () => {
    if (updating) return;

    setIsFollowing(false);
    setUpdating(true);

    try {
      await request.post(`/follow/remove`, {
        following_id: userToFollowId,
      });

      onComplete(false);
    } catch (err: any) {
      setIsFollowing(true);
      toast.error(err.response.data.message);
    } finally {
      setUpdating(false);
    }
  };

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  return (
    <button
      disabled={updating}
      onClick={
        !isLoggedIn
          ? () => toggleDialogVisibility(true, <SignIn />)
          : isFollowing
          ? handleUnFollowUser
          : handleFollowUser
      }
      className="flex flex-row items-center px-[18px] sm:px-[22px] py-[12px] rounded-[10px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:text-white hover:opacity-90 disabled:opacity-70 disabled:border-none"
    >
      <span className="ml-[5px]">
        {isFollowing ? 'Unfollow' : 'Follow'}
      </span>
    </button>
  );
};
