import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { timeAgo, useAuthDialogStore, usePropActions, usePropState} from '@your-props/client/utils';
import { SignIn } from '../../auth/SignIn';

import 'react-tabs/style/react-tabs.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import defaultProfileImage from '../../theme/assets/images/avatar/user-img.png';

export const PropComments = ({
  propId = '',
  disabled,
}: {
  propId: string
  disabled?: boolean;
}) => {
  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  const { toggleDialogVisibility } = useAuthDialogStore();

  const { addComment } = usePropActions();
  const { prop, isAddingComment } = usePropState();

  const [commentData, setCommentData] = useState('');

  const submitComment = async () => {
    if (commentData != '') {
      await addComment(propId, commentData);
      setCommentData('');
    }
  };

  const handleCommentChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommentData(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitComment();
    }
  };

  return (
    <div className="py-[30px]">
      <div className="flex flex-col">
        <div className="text-[18px] font-bold leading-[26px] text-[#C5B6B3] mb-[20px]">
          Comments
        </div>

          <div className="overflow-y-scroll">
            {prop && prop.productComments?.[0]?.length > 0 ? (
              prop.productComments?.[0]?.map(
                (comment: {
                  id: string;
                  userId: string;
                  comment: string;
                  createdAt: string;
                  userAvatar: string;
                  userUsername: string;
                }) => {
                  return (
                    <div className="flex flex-row gap-3 mb-3" key={comment.id}>
                      <div className="w-[24px] min-w-[24px] h-[24px] rounded-[10px]">
                        <Link
                          to={`/user/${comment?.userId}/details`}
                          className="hover:text-inherit"
                        >
                          <img
                            alt="User"
                            src={comment?.userAvatar || defaultProfileImage}
                            className="rounded-[10px] w-full h-full object-cover default_image mt-1"
                          />
                        </Link>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex flex-row items-center">
                          <Link
                            to={`/user/${comment?.userId}/details`}
                            className="hover:text-inherit"
                          >
                            <span className="text-[16px] font-bold leading-[20px]">
                              {comment?.userUsername}
                            </span>
                          </Link>

                          <span className="text-[12px] leading-[20px] text-[#C5B6B3] ml-[6px]">
                            {timeAgo(comment?.createdAt)}
                          </span>
                        </div>

                        <p className="">{comment?.comment}</p>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="flex mb-[30px] text-[15px]">No comments added.</div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="mt-6 relative">
              <input
                type="text"
                value={commentData}
                onKeyDown={handleKeyDown}
                placeholder="Leave a comment"
                onChange={handleCommentChange}
                disabled={isAddingComment || disabled}
                className="w-full h-[46px] rounded-[8px] comments !pr-[100px]"
              />
              <button
                disabled={isAddingComment || commentData === '' || disabled}
                className="absolute right-2 top-2 h-[35px] px-[14px] py-[5px] rounded-[6px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70"
                onClick={submitComment}
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="mt-6 relative">
              <input
                onClick={() => toggleDialogVisibility(true, <SignIn />)}
                type="text"
                value={commentData}
                placeholder="Leave a comment"
                className="w-full h-[46px] rounded-[8px] comments !pr-[100px]"
              />
              <button
                onClick={() => toggleDialogVisibility(true, <SignIn />)}
                className="absolute right-2 top-2 h-[35px] px-[14px] py-[5px] rounded-[6px] bg-[#EF6A3B] border-[#EF6A3B] focus:text-white hover:opacity-90 hover:text-white disabled:opacity-70"
              >
                Submit
              </button>
            </div>
          )}
      </div>
    </div>
  );
};
