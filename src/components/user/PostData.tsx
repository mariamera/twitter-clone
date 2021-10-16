import clsx from 'clsx';
import React, { ReactElement, useState, useEffect } from 'react'
import Link from 'next/link';
import setDate from '../../helpers/date';
import { useAuth } from '../../context/authContext';
import Avatar from '../Avatar/Avatar';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import DeleteIcon from '@material-ui/icons/Delete';

import {
  addLike,
  checkPostLikes,
  userLikedPost,
  userDisLikedPost,
} from '../../helpers/queries';

interface Props {
  user: Object
  post: Object
}

export default function PostData({ user, post }: Props): ReactElement {
  const { currentUser, deletePost } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, serNumberOfLikes] = useState(false);
  const [likeDocID, setLikeDocID] = useState("");

  function belongsToCurrentUser(currentUser, postAuthor) {
    if (!currentUser) return false;

    return currentUser.email === postAuthor.email;
  }

  async function deleteThisPost() {
    try {
      await deletePost(post.postID);
    } catch (e) {
      console.log("error while deleting post: ", e);
    }
  }

  async function manageLike() {
    try {
      if (isLiked) {
        await userDisLikedPost(likeDocID);
        setIsLiked(false);
        setLikeDocID('');
        serNumberOfLikes(prev => prev - 1);
      } else {
        const like = await addLike(post.postID, currentUser.uid);
        const id = await like.get()
        setLikeDocID(id.id);
        setIsLiked(true);
        serNumberOfLikes(prev => prev + 1);
      }
    } catch (error) {
      console.log("error: ", error);
      return;
    }
  }

  useEffect(async () => {
    try {
      const like = await checkPostLikes(post.postID);
      serNumberOfLikes(like.size);
      setLikeDocID(like.docs[0] && like.docs[0].id);

      const checkLike = await userLikedPost(post.postID, currentUser.uid);
      setIsLiked(!!checkLike);

    } catch (err) {
      console.log("err: ", err);

      return;
    }
  }, []);

  return (
    <div className="relative flex flex-wrap w-full p-4 my-2 hover:bg-gray-200">
      <div>
        <Link href={`/${user.username}`}>
          <a>
            <Avatar altText={`${user.username} profile picture`} userPhoto={user.photoURL} />
          </a>
        </Link>
      </div>
      <div className="px-4 flex-auto">
        <Link href={`/${user.username}/status/${post.postID}`}>
          <a className="flex-auto">
            <h4 className="font-bold text-lg">{user.displayName}
              <span className="font-normal color-gray-400 text-sm px-1">{user.username}</span>
            </h4>
            <span className="text-sm color-secondary">{setDate(post.date)}</span>
            <div className="w-full">
              {post.text}
            </div>
          </a>
        </Link>
        <div className="z-10">
          <button onClick={manageLike} disabled={!currentUser} className={"text-secondary flex"}>
            <span className="pr-2">{numberOfLikes}</span>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </button>
          {belongsToCurrentUser(currentUser, user) && <button className="absolute top-4 right-4" onClick={deleteThisPost}> <DeleteIcon /> </button>}
        </div>
      </div>
    </div>
  )
}
