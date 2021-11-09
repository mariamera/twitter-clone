import React, { useState, useContext, useEffect } from 'react';
import { getAllPost, getUserFollowing, subscribePost, getUserInfoById, getSinglePost, getCommentsFromPost } from '../helpers/queries';
import { useAuth } from "./AuthContext";

type Props = {
  children: React.ReactNode;
};

type user = {
  posts: []
};

const defaultState = {
  posts: [],
};

const PostContext = React.createContext(defaultState);


export function usePost() {
  return useContext(PostContext);
}

export function PostProvider({ children }: Props) {
  const [offset, setOffset] = useState();
  const [posts, setPosts] = useState([]);
  const [userList, setUserList] = useState([]);
  const [currentFollowing, setCurrentFollowing] = useState<Array<string>>([]);
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

  async function getComments(postID: string) {
    const commentsList = await getCommentsFromPost(postID);

    return commentsList;
  }

  const resetPost = async () => {
    if (currentUser && currentUser.uid) {
      const following = await getUserFollowing(currentUser.uid);
      let ids = following.docs.map(follow => follow.data().followeeId);
      const userFollowingList = [currentUser.uid, ...ids];

      if (userFollowingList && userFollowingList.length) {

        const followersSnapShot = await getAllPost(userFollowingList, pageSize);

        if (followersSnapShot.length) {
          setOffset(followersSnapShot[followersSnapShot.length - 1].post);
          setPosts([...followersSnapShot]);
        }
      }

      setCurrentFollowing(userFollowingList);
    }
  };

  async function getParentPost(parentPostId: string) {
    if (parentPostId) {
      const parentPost = await getSinglePost(parentPostId);

      if (parentPost && !parentPost.empty && parentPost.docs.length === 1) {
        const parentPostData = parentPost.docs[0].data();
        if (parentPostData.uid) {
          const user = await getUserInfoById(parentPostData.uid);
          return {
            post: parentPostData,
            user: { uid: user.key, ...user.val() },
          };
        }
      }
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
    let unsubscribe;

    if (currentUser && currentUser.uid) {
      let userFollowingList: Array<String> = [];

      const following = await getUserFollowing(currentUser.uid);

      if (following.size) {
        let ids = following.docs.map(follow => follow.data().followeeId);

        userFollowingList = [currentUser.uid, ...ids];
      } else {
        userFollowingList = [currentUser.uid];
      }


      unsubscribe = subscribePost(userFollowingList, pageSize).onSnapshot(async snap => {
        const users = [];
        const data = await Promise.all(snap.docs.map(async doc => {
          const info = doc.data()
          const user = await getUserInfoById(info.uid);
          return {
            user: { uid: user.key, ...user.val() },
            post: info
          }
        }))

        if (data.length) {
          setOffset(data[data.length - 1].post);
          setPosts([...data]);
        }

        setCurrentFollowing(userFollowingList);
        setLoading(false);
      });

      return () => unsubscribe();
    }

    setLoading(false);
  }, []);

  const postValue = {
    posts,
    addFollow,
    getPosts,
    resetPost,
    getParentPost,
    getComments
  };


  return (
    <PostContext.Provider value={postValue} >
      {!loading && children}
    </PostContext.Provider >
  )
}