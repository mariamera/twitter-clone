import React, { useEffect, useState } from "react";
import { getAllPost, getUserFollowing , subscribePost , getUserInfoById } from '../helpers/queries';
import { useAuth } from '../context/authContext';

export function usePost(pageSize: number) {
  const [offset, setOffset] = useState();
  const [posts, setPosts] = useState<Array[]>([]);
  const { currentUser } = useAuth();
  const [followingList, setFollowingList] = useState([]);

  // const getPosts = async () => {
  //   if (followingList.length) {
  //     const followersSnapShot = await getAllPost(followingList, pageSize, offset);

  //     if (followersSnapShot.length) {
  //       setOffset(followersSnapShot[followersSnapShot.length - 1].post);
  //       setPosts((prevState) => [...prevState, ...followersSnapShot]);
  //     }
  //   }
  // };


  // useEffect(async () => {
  //   let currentFollowing = [];
  //   const following = await getUserFollowing(currentUser.uid);
  
  //   if (following.size) {
  //     let ids = following.docs.map(follow => follow.data().followeeId);

  //     currentFollowing = [currentUser.uid, ...ids];
  //   } else {
  //     currentFollowing  = [currentUser.uid ];
  //   }

  //   setFollowingList(currentFollowing);

  //   const unsubscribe = subscribePost(currentFollowing,pageSize).onSnapshot(async snap => {
  //     const data = await Promise.all(snap.docs.map(async doc => {
  //       const info = doc.data()
  //       const user = await getUserInfoById(info.uid)
  //       return {
  //         user: user.val(),
  //         post: info
  //       }
  //     }))

  //     setOffset(data[data.length - 1].post);
  //     setPosts((prevState) => [...data]);
  //   });

  //   return () => unsubscribe()

  // }, []);

  return [posts, getPosts];
}