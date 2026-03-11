import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

import { request, useAuthDialogStore } from '@your-props/client/utils';
import { HeartFilledIcon, HeartIcon } from '@your-props/client/icons';

import 'react-tabs/style/react-tabs.css';
import { useParams } from 'react-router-dom';
import { SignIn } from '../../auth/SignIn';

export const PropLike = ({ disabled, propId = '' }: { disabled?: boolean, propId: string }) => {
  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  const { toggleDialogVisibility } = useAuthDialogStore();

  const user = JSON.parse(localStorage.getItem('user') as string);
  const userId = user?.id;

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [likesData, setLikesData] = useState<{ likes: { userId: any }[]; totalLikes: number }>({
    likes: [],
    totalLikes: 0,
  });

  const [fetchingLikes, setFetchingLikes] = useState(false);

  const params = useParams();

  useEffect(() => {
    getPropLikes();
  }, [params.id]);

  const getPropLikes = async () => {

    setFetchingLikes(true);
    try {
      const { data } = await request.get(`/products/${propId}/likes`);
      setLikesData(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load likes');
    } finally {
      setFetchingLikes(false);
    }
  };

  const handlePropLike = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to like this prop!');
      return;
    }

    if (loadingId) return;

    const isLiked = likesData.likes.some((like: { userId: any }) => like.userId === userId);
    const updatedLikes = isLiked ? likesData.totalLikes - 1 : likesData.totalLikes + 1;
    setLikesData(prev => ({
      ...prev,
      totalLikes: updatedLikes,
      likes: isLiked ? prev.likes.filter(like => like.userId !== userId) : [...prev.likes, { userId }]
    }));
    setLoadingId(propId);

    try {
      if (isLiked) {
        await request.delete(`/products/${propId}/unlike`);
      } else {
        await request.post(`/products/${propId}/like`, {});
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update like');
      getPropLikes(); // Revert to correct count on failure
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <button
      onClick={
        !isLoggedIn
          ? () => toggleDialogVisibility(true, <SignIn />)
          : handlePropLike
      }
      disabled={fetchingLikes || disabled || loadingId !== null}
      className="h-[50px] w-[80px] p-[12px] bg-[#676767] flex justify-center items-center rounded-[10px] border-[#676767] hover:opacity-90 hover:text-white hover:border-[#676767] disabled:pointer-events-none disabled:opacity-70"
    >
      <span className="wishlist-button h-[50px] w-[50px] text-[18px] font-bold leading-[22px] contents">
        <span className="text-[18px] font-bold leading-[22px] flex flex-row items-center justify-center gap-1">
          {likesData.likes.some((like: { userId: any }) => like.userId === userId) ? <HeartFilledIcon /> : <HeartIcon />}
          <p className="ml-2">{likesData.totalLikes}</p>
        </span>
      </span>
    </button>
  );
};
