import clsx from "clsx";
import React, { ReactElement, useState, useEffect } from "react";
import Link from "next/link";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import DeleteIcon from "@material-ui/icons/Delete";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import setDate from "../../helpers/date";
import {
  addLike,
  checkPostLikes,
  userDisLikedPost,
  checkPostComment,
} from "../../helpers/queries";
import { useAuth } from "../../context/AuthContext";
import { singlePostType, UserType } from "../../helpers/types";
import Avatar from "../Avatar/Avatar";
import { logError } from "../../helpers/utils";
import { usePostInfo } from "../../hooks/usePostInfo";
import DeletedPost from "./DeletedPost";

interface Props {
  user: UserType;
  post: singlePostType;
  showParentText: boolean;
}

export default function PostData({
  user,
  post,
  showParentText = false,
}: Props): ReactElement {
  const { currentUser, deletePost } = useAuth();
  const [isLiked, numLikes, docId, dispatch] = usePostInfo(post.postID);
  const [numberOfComments, setNumberOfComments] = useState(0);

  function belongsToCurrentUser(
    currentUser: firebase.User | undefined,
    postAuthor: UserType
  ) {
    if (!currentUser) {
      return false;
    }

    return currentUser.uid === postAuthor.uid;
  }

  async function deleteThisPost() {
    try {
      await deletePost(post.postID);
    } catch (error) {
      logError(error);
    }
  }

  async function manageLike() {
    try {
      if (isLiked) {
        await userDisLikedPost(docId);
        dispatch({
          type: "updateLike",
          payload: {
            isLiked: false,
            numLikes: numLikes ? numLikes - 1 : 0,
            docId: "",
          },
        });
      } else {
        const like = await addLike(post.postID, currentUser!.uid);
        const likeInfo = await like.get();
        const id = likeInfo.id;

        dispatch({
          type: "updateLike",
          payload: {
            isLiked: true,
            numLikes: numLikes ? numLikes + 1 : 1,
            docId: id,
          },
        });
      }
    } catch (error) {
      logError(error);
    }
  }

  useEffect(() => {
    if (!Object.keys(post).length) {
      return;
    }

    const fetchData = async () => {
      try {
        const comments = await checkPostComment(post.postID);
        setNumberOfComments(comments.size);
      } catch (error) {
        logError(error);
      }
    };

    void fetchData();
  }, [post, currentUser]);

  if (Object.keys(post).length === 0) {
    return <DeletedPost />;
  }

  if (!user.username) {
    return <></>;
  }

  return (
    <div
      className={clsx(
        "relative flex flex-wrap w-full p-4 hover:bg-gray-200",
        !showParentText && "border-t my-0"
      )}
    >
      <div>
        <Link href={`/${user.username}`}>
          <a className="z-10 relative block">
            <Avatar
              altText={`${user.username} profile picture`}
              userPhoto={user.photoURL}
            />
          </a>
        </Link>
      </div>
      <div style={{ flex: "1 1 0" }} className="px-4 flex-grow-0">
        <Link href={`/${user.username}/status/${post.postID}`}>
          <a className="flex-auto">
            <h4 className="font-bold text-lg">
              {user.displayName}
              <span className="font-normal color-gray-400 text-sm px-1">
                {user.username}
              </span>
            </h4>
            <span className="text-sm color-secondary">
              {setDate(post.date)}
            </span>
            <div className="w-full mb-4">{post.text}</div>
          </a>
        </Link>
        <div className="z-10 flex">
          <button disabled={!currentUser} className="text-secondary flex mx-2">
            <span className="pr-2">{numberOfComments}</span>
            <ChatBubbleOutlineIcon />
          </button>
          <button
            onClick={manageLike}
            disabled={!currentUser}
            className="text-secondary flex mx-2"
          >
            <span className="pr-2">{numLikes}</span>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </button>
          {belongsToCurrentUser(currentUser, user) && (
            <button className="absolute top-4 right-4" onClick={deleteThisPost}>
              {" "}
              <DeleteIcon />{" "}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
