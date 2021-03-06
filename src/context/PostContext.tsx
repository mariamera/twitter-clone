import React, { useState, useContext, useEffect } from "react";
import {
  getAllPost,
  getUserFollowing,
  stopFollowing,
  startFollowing,
  subscribePost,
  getUserInfoById,
  getSinglePost,
  getCommentsFromPost,
} from "../helpers/queries";
import { PostType, singlePostType } from "../helpers/types";
import { useAuth } from "./AuthContext";

type Props = {
  children: React.ReactNode;
};

type PostContext = {
  posts: Array<PostType>;
  getPosts: () => void;
  getParentPost?: (parentPostId: string) => Promise<PostType>;
  resetPost: () => void;
};

const defaultState = {
  posts: [],
  getPosts: () => {},
  resetPost: () => {},
};

const PostContext = React.createContext<PostContext>(defaultState);

export function usePost() {
  return useContext(PostContext);
}

export function PostProvider({ children }: Props) {
  const [offset, setOffset] = useState<singlePostType>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentFollowing, setCurrentFollowing] = useState<Array<string>>([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  async function addFollow(newFollowindId: string) {
    setCurrentFollowing((prev) => [...prev, newFollowindId]);
    await resetPost();
  }

  async function removeFollow(followindId: string) {
    setCurrentFollowing((prev) => prev.filter((id) => id !== followindId));
    await resetPost();
  }

  async function getComments(postIDArray: firebase.firestore.DocumentData[]) {
    const commentsList = await getCommentsFromPost(postIDArray);

    return commentsList;
  }

  const resetPost = async () => {
    if (currentUser && currentUser.uid) {
      const following = await getUserFollowing(currentUser.uid);
      const ids = following.docs.map((follow) => follow.data().followeeId);
      const userFollowingList: string[] = [currentUser.uid, ...ids];

      if (userFollowingList.length) {
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

      if (!parentPost.empty && parentPost.docs.length === 1) {
        const parentPostData = parentPost.docs[0].data();
        if (parentPostData.uid) {
          const user = await getUserInfoById(parentPostData.uid as string);
          if (user) {
            return {
              post: parentPostData,
              user: { uid: user.key, ...user.val() },
            } as PostType;
          }
        }
      }
    }

    return {
      post: {},
      user: {},
    } as PostType;
  }

  const getPosts = async () => {
    if (currentFollowing.length) {
      const followersSnapShot = await getAllPost(
        currentFollowing,
        pageSize,
        offset
      );

      if (followersSnapShot.length) {
        setOffset(followersSnapShot[followersSnapShot.length - 1].post);
        setPosts((prevState) => [...prevState, ...followersSnapShot]);
      }
    }
  };

  useEffect(() => {
    let unsubscribe: React.EffectCallback;

    const fetchPost = async () => {
      if (currentUser && currentUser.uid) {
        let userFollowingList: Array<string> = [];

        const following = await getUserFollowing(currentUser.uid);

        if (following.size) {
          const ids = following.docs.map((follow) => follow.data().followeeId);

          userFollowingList = [currentUser.uid, ...ids];
        } else {
          userFollowingList = [currentUser.uid];
        }

        unsubscribe = subscribePost(userFollowingList, pageSize).onSnapshot(
          async (snap) => {
            const data: PostType[] = await Promise.all(
              snap.docs.map(async (doc) => {
                const info = doc.data();
                const user = await getUserInfoById(info.uid as string);
                if (user) {
                  return {
                    user: { uid: user.key, ...user.val() },
                    post: info,
                  } as PostType;
                }

                return {
                  post: {},
                  user: {},
                } as PostType;
              })
            );

            if (data.length) {
              setOffset(data[data.length - 1].post);
              setPosts([...data]);
            }

            setCurrentFollowing(userFollowingList);
          }
        );
      }

      return () => unsubscribe();
    };

    void fetchPost();
    setLoading(false);
  }, [currentUser]);

  const postValue = {
    posts,
    addFollow,
    removeFollow,
    getPosts,
    resetPost,
    getParentPost,
    getComments,
  };

  return (
    <PostContext.Provider value={postValue}>
      {!loading && children}
    </PostContext.Provider>
  );
}
