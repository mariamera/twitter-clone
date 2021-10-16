import clsx from 'clsx';
import React, { useEffect, useState } from 'react'
import PostData from './PostData';
import { usePost } from '../../context/postContext';

import {
  getSinglePost,
  getUserInfoById
} from '../../helpers/queries';

export default function Post({ user, post, showParentText = false }) {
  const [parentTweet, setParentTweet] = useState({});
  const { getParentPost } = usePost();

  useEffect(async () => {
    try {
      if (showParentText && post.parentId) {
        const parentPost = await getParentPost(post.parentId);

        setParentTweet(parentPost);
        return;
      }
      setParentTweet({});
    } catch (err) {
      console.log("err: ", err);

      return;
    }
  }, [post]);

  return (
    <>
      <div className={clsx("relative flex flex-wrap w-full rounded-lg bg-white", showParentText && "px-4 my-2 border border-gray-200")}>
        {parentTweet.user && parentTweet.post && showParentText && (
          <>
            <PostData user={parentTweet.user} post={parentTweet.post} />
            <div className="absolute h-1/2 top-16 border-l border-primary transform translate-x-8 left-8" />
          </>)}
        <PostData user={user} post={post} />
      </div>
    </>
  )
}
