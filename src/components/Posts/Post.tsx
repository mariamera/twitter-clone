import clsx from 'clsx';
import React, { useEffect, useState } from 'react'
import PostData from './PostData';
import { usePost } from '../../context/PostContext';

import { singlePostType, PostType , UserType} from "../../helpers/types";

type Props = {
  user: UserType,
  post: singlePostType,
  showParentText?: boolean
};

export default function Post({ user, post, showParentText = false }: Props) {
  const [parentTweet, setParentTweet] = useState<PostType>();
  const { getParentPost } = usePost();


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (showParentText && post.parentId) {
          const parentPost = await getParentPost!(post.parentId);

          setParentTweet(parentPost);
          return;
        }

        setParentTweet(undefined);
      } catch (err) {
        console.log("err: ", err);
        return;
      }
    };

    fetchData();

  }, [post]);

  return (
    <>
      <div className={clsx("relative flex flex-wrap w-full bg-white", showParentText && "mt-4 border border-gray-200 rounded-lg")}>
        {parentTweet && parentTweet.user && parentTweet.post && showParentText && (
          <>
            <PostData user={parentTweet.user} post={parentTweet.post} showParentText={showParentText} />
            <div className="absolute h-1/2 top-16 border-l border-secondary transform translate-x-2 left-8" />
          </>)}
        <PostData user={user} post={post} showParentText={showParentText} />
      </div>
    </>
  )
}
