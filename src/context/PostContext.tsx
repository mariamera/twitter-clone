import React, { useState, useContext, useEffect } from 'react';
// import { database } from '../helpers/firebase';
import { getAllPost, getUserFollowing, subscribePost, getUserInfoById } from '../helpers/queries';
import { useAuth } from "./authContext";

const PostContext = React.createContext({});

export function usePost() {
  return useContext(PostContext);
}

export function PostProvider({ value, children }) {
  const [offset, setOffset] = useState();
  const [posts, setPosts] = useState([]);
  const [currentFollowing, setCurrentFollowing] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true)

  const pageSize = 10;

  async function fetchPost() {
    // let userFollowingList = [];
    console.log("fetchingg....");
    // const following = await getUserFollowing(currentUser.uid);

    // if (following.size) {
    //   userFollowingList = [currentUser.uid, ...ids];

    // }
  }

  const getPosts = async () => {
    if (currentFollowing.length) {
      const followersSnapShot = await getAllPost(currentFollowing, pageSize, offset);

      if (followersSnapShot.length) {
        setOffset(followersSnapShot[followersSnapShot.length - 1].post);
        setPosts((prevState) => [...prevState, ...followersSnapShot]);
      }
    }
  };

  useEffect(async () => {
    if (currentUser) {
      let userFollowingList: Array<String> = [];

      const following = await getUserFollowing(currentUser.uid);

      if (following.size) {
        let ids = following.docs.map(follow => follow.data().followeeId);

        userFollowingList = [currentUser.uid, ...ids];
      } else {
        userFollowingList = [currentUser.uid];
      }


      const unsubscribe = subscribePost(userFollowingList, pageSize).onSnapshot(async snap => {
        const data = await Promise.all(snap.docs.map(async doc => {
          const info = doc.data()
          const user = await getUserInfoById(info.uid)
          return {
            user: user.val(),
            post: info
          }
        }))

        if ( data.length ) {
          setOffset(data[data.length - 1].post);
          setPosts((prevState) => [...data]);
        }

        setCurrentFollowing(userFollowingList);
        setLoading(false);
      });

      return unsubscribe;
    } 

    setLoading(false);
  }, []);

  const postValue = {
    posts,
    fetchPost,
    getPosts
  };


  return (
    <PostContext.Provider value={{...value, ...postValue}} >
      {!loading && children}
    </PostContext.Provider >
  )
}