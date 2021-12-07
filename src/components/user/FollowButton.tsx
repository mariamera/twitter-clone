import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../context/PostContext";
import { startFollowing, stopFollowing } from "../../helpers/queries";

import { db } from "../../helpers/firebase";
import { UserType } from "../../helpers/types";

type Props = {
  onClick?: (isFollowing: boolean) => void;
  user: UserType;
};

export default function FollowButton({ onClick, user }: Props) {
  const { currentUser } = useAuth();
  const { resetPost } = usePost();
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectionDocID, setFollowingDocID] = useState("");

  async function handleFollow() {
    try {
      if (isFollowing) {
        await stopFollowing(connectionDocID);
        setIsFollowing(false);
      } else {
        await startFollowing(currentUser!.uid, user.uid || "");
        setIsFollowing(true);
      }

      resetPost();
      if (onClick) {
        onClick(isFollowing);
			}
    } catch (e) {
      console.log("something wrong happened"); //Fix This
    }
  }

  async function checkFollowing() {
    const result = await db
      .collection("follows")
      .where("followerId", "==", currentUser!.uid)
      .where("followeeId", "==", user.uid)
      .get();

    if (result.size) {
      setIsFollowing(true);
      setFollowingDocID(result.docs[0].id);
    }
  }

  useEffect(() => {
    const fetchFollowData = async () => {
      if (user.username && user.uid) {
        void checkFollowing();
      }
    };

    void fetchFollowData();
  }, [user]);

  if (currentUser!.uid === user.uid) {
    return null;
  }

  return (
    <button
      className="block ml-auto mt-4 bg-secondary text-white hover:bg-third text-white font-bold py-2 px-4 rounded"
      onClick={handleFollow}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
