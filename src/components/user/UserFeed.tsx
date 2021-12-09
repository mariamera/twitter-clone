import React, { useEffect, useState } from "react";
import Link from "next/link";
import NewPost from "../modal/NewPost";
import { useAuth } from "../../context/AuthContext";
import { useFollowing } from "../../hooks/useFollowing";

import { UserType } from "../../helpers/types";
import Avatar from "../Avatar/Avatar";
import Followers from "../modal/Followers";
import FollowButton from "./FollowButton";
import Tabs from "./Tabs";

type Props = {
  user: UserType;
};

export default function UserFeed({ user }: Props) {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [followersList, getFollowing] = useFollowing();

  async function handleFollow(updateFollow: boolean) {
    setError("");
    try {
      if (updateFollow) {
        setFollowers((v) => (v ? v - 1 : 0));
      } else {
        setFollowers((v) => (v ? v + 1 : 1));
      }
    } catch (e) {
      setError("something wrong happened");
    }
  }

  function openFollowersModal() {
    if (user.uid) {
      getFollowing(user.uid);
      setOpenModal(true);
    }
  }

  useEffect(() => {
    setFollowers(user.followers);
    setFollowing(user.following);

    return () => {
      setOpenModal(false);
    };
  }, [user]);

  if (!user.username) {
    return <></>;
  }

  return (
    <div className="w-full bg-primary">
      <div className="min-h-full h-44 bg-gradient-to-tl from-secondary" />
      <div className="md:w-3/4 md:mx-auto md:-my-8">
        <div className="p-8 flex flex-wrap md:flex-nowrap bg-white md:min-h-full">
          <div className="w-auto mx-auto -mb-12 transform -translate-y-1/2 md:-mb-20">
            <Avatar
              altText={`${user.username} profile picture`}
              userPhoto={user.photoURL}
              size={{ height: "150", width: "150" }}
            />
          </div>
          <div className="w-full md:w-auto md:flex md:items-end md:flex-wrap md:ml-auto transform mt-auto ">
            <h2 className="text-center mx-auto w-full text-2xl font-mono font-semibold tracking-tight">
              {user.displayName}
            </h2>
            <h3 className="text-center mx-auto w-full text-sm text-gray-400">
              @{user.username}
            </h3>
            <div className="w-full flex justify-evenly">
              <button>
                <p className="font-semibold">
                  {followers}{" "}
                  <span className="text-gray-500 front-normal">followers</span>
                </p>
              </button>
              <button onClick={openFollowersModal}>
                <p className="font-semibold">
                  {following}{" "}
                  <span className="text-gray-500 front-normal">following</span>
                </p>
              </button>
            </div>
            <div>
              {currentUser!.uid !== user.uid ? (
                <FollowButton onClick={handleFollow} user={user} />
              ) : (
                <Link href={`/settings`}>
                  <a className="block ml-auto mt-4 bg-secondary text-white hover:bg-third text-white font-bold py-2 px-4 rounded">
                    Edit Profile
                  </a>
                </Link>
              )}

            </div>
          </div>
        </div>
        <Tabs user={user} />
      </div>
      <NewPost />
      <Followers
        userList={followersList}
        isOpen={openModal}
        onClick={() => setOpenModal(false)}
      />
    </div>
  );
}
