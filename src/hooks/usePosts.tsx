import React, { useEffect, useState } from "react";
import { getAllPost, getUserFollowing } from '../helpers/queries';
import { useAuth } from '../context/authContext';

export function usePost(pageSize: number) {
  const [offset, setOffset] = useState();
  const [posts, setPosts] = useState<Array[]>([]);
  const { currentUser } = useAuth();
  const [followingList, setFollowingList] = useState([currentUser.uid]);

  const getPosts = async () => {
    if (followingList.length) {
      const followersSnapShot = await getAllPost(followingList, pageSize, offset);

      if (followersSnapShot.length) {
        setOffset(followersSnapShot[followersSnapShot.length - 1].post);
        setPosts((prevState) => [...prevState, ...followersSnapShot]);
      }
    }
  };

  useEffect(async () => {
    const following = await getUserFollowing(currentUser.uid);
    if (following.size) {
      let ids = following.docs.map(follow => follow.data().followeeId);

      setFollowingList((prevState) => [...prevState, ...ids]);
    }
  }, []);

  return [posts, getPosts];
}