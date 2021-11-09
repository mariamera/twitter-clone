import clsx from 'clsx';
import React, { useEffect, useState } from 'react'
import PostData from './PostData';
import { usePost } from '../../context/PostContext';

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
      <div className={clsx("relative flex flex-wrap w-full bg-white", showParentText && "mt-4 border border-gray-200 rounded-lg")}>
        {parentTweet.user && parentTweet.post && showParentText && (
          <>
            <PostData user={parentTweet.user} post={parentTweet.post} showParentText={showParentText}/>
            <div className="absolute h-1/2 top-16 border-l border-secondary transform translate-x-2 left-8" />
          </>)}
        <PostData user={user} post={post} showParentText={showParentText}/>
      </div>
    </>
  )
}
