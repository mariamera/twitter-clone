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
import DeletedPost from "./DeletedPost";

interface Props {
  user: UserType;
  post: singlePostType;
  showParentText: boolean;
}

function logError(error: any) {
  let errorMessage = "Failed to do something exceptional";

  if (error instanceof Error) {
    errorMessage = error.message;
  }
  return `error while changing like: ${errorMessage}`;
}

export default function PostData({
  user,
  post,
  showParentText = false,
}: Props): ReactElement {
  const { currentUser, deletePost } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [likeDocID, setLikeDocID] = useState("");

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
      let id = "";
      if (isLiked) {
        await userDisLikedPost(likeDocID);
      } else {
        const like = await addLike(post.postID, currentUser!.uid);
        const likeInfo = await like.get();
        id = likeInfo.id;
      }

      setLikeDocID(id);
      setNumberOfLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((v) => !v);
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
        const like = await checkPostLikes(post.postID);
        const likeDocs = like.docs[0];
        setNumberOfLikes(like.size);
        setLikeDocID(likeDocs.id);

        const checkLike = like.docs.find((val) => {
          const user = val.data();
          return user.userid === currentUser!.uid;
        });

        setIsLiked(!!checkLike);

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
            <span className="pr-2">{numberOfLikes}</span>
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
