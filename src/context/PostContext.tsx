import React, { useState, useContext, useEffect } from 'react';
import { getAllPost, getUserFollowing, subscribePost, getUserInfoById , getSinglePost} from '../helpers/queries';
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

  async function addFollow(newFollowindId: string) {
    setCurrentFollowing(prev => [...prev, newFollowindId]);
    await resetPost();

  }

  async function removeFollow(followindId: string) {
    setCurrentFollowing(prev => prev.filter(id => id !== followindId))
    await resetPost();
  }

  const resetPost = async () => {
    const following = await getUserFollowing(currentUser.uid);
    let ids = following.docs.map(follow => follow.data().followeeId);
    const userFollowingList = [currentUser.uid, ...ids];

    if (userFollowingList) {
      const followersSnapShot = await getAllPost(userFollowingList, pageSize);

      if (followersSnapShot.length) {
        setOffset(followersSnapShot[followersSnapShot.length - 1].post);
        setPosts([...followersSnapShot]);
        console.log("[...followersSnapShot: ", [...followersSnapShot]);
      }
    }

    setCurrentFollowing(userFollowingList);
  };

  async function getParentPost(parentPostId) {
    const parentPost = await getSinglePost(parentPostId);

    if (parentPost && parentPost.docs.length === 1) {
      const parentPostData = parentPost.docs[0].data();
      const user = await getUserInfoById(parentPostData.uid);
      return {
        post: parentPostData,
        user: user.val()
      };

    }

    return {
      post: {},
      user: {}
    }
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

        if (data.length) {
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
    addFollow,
    getPosts,
    resetPost,
    getParentPost
  };


  return (
    <PostContext.Provider value={{ ...value, ...postValue }} >
      {!loading && children}
    </PostContext.Provider >
  )
}