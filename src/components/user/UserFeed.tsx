import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import NewPost from '../modal/NewPost';
import { findUserPosts, startFollowing, stopFollowing } from '../../helpers/queries';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../context/PostContext';
import { useFollowing } from '../../hooks/useFollowing';

import Post from '../Posts/Post';
import { db } from '../../helpers/firebase';
import Avatar from '../Avatar/Avatar';
import Followers from '../modal/Followers';

import { UserType, singlePostType } from "../../helpers/types";

type Props = {
  user: UserType
};

export default function UserFeed({ user }: Props) {
  const [post, setPost] = useState<Array<singlePostType>>([]);
  const [error, setError] = useState('');
  const { resetPost } = usePost();
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(user.followers);
  const [following, setFollowing] = useState(user.following);
  const [connectionDocID, setFollowingDocID] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [followersList, getFollowing] = useFollowing();

  async function handleFollow() {
    setError('');
    try {
      if (isFollowing) {
        await stopFollowing(connectionDocID)
        resetPost();
        setIsFollowing(false);
        setFollowers(v => v ? v - 1 : 0);
      } else {
        await startFollowing(currentUser!.uid, user.uid || '');
        resetPost();
        setIsFollowing(true)
        setFollowers(v => v ? v + 1 : 1);
      }
    } catch (e) {
      setError('something wrong happened');
    }
  }

  function openFollowersModal() {
    if (user.uid) {
      getFollowing(user.uid);
      setOpenModal(true);
    }
  }

  async function checkFollowing() {
    const result = await
      db
        .collection('follows')
        .where('followerId', '==', currentUser!.uid)
        .where('followeeId', '==', user.uid)
        .get();

    if (result.size === 1) {
      setIsFollowing(true);
      setFollowingDocID(result.docs[0].id);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.username) {
        void checkFollowing();

        const getPost: singlePostType = await findUserPosts(user.username); //TODO: change Any to correct type

        setPost(getPost);
      }
    }

    void fetchUserData();

    return () => {
      setPost([]);
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
            <Avatar altText={`${user.username} profile picture`} userPhoto={user.photoURL} size={{ height: "150", width: "150" }} />
          </div>
          <div className="w-full md:w-auto md:flex md:items-end md:flex-wrap md:ml-auto transform mt-auto ">
            <h2 className="text-center mx-auto w-full text-2xl font-mono font-semibold tracking-tight">{user.displayName}</h2>
            <h3 className="text-center mx-auto w-full text-sm text-gray-400">{user.username}</h3>
            <div className="w-full flex justify-evenly">
              <button>
                <p className="font-semibold">{followers} <span className="text-gray-500 front-normal">followers</span></p>
              </button>
              <button onClick={openFollowersModal}>
                <p className="font-semibold">{following} <span className="text-gray-500 front-normal">following</span></p>
              </button>
            </div>
            <div>
              {currentUser!.uid !== user.uid ?
                (<button
                  className="block ml-auto mt-4 bg-secondary text-white hover:bg-third text-white font-bold py-2 px-4 rounded"
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>) :
                (
                  <Link href={`/profile`}>
                    <a
                      className="block ml-auto mt-4 bg-secondary text-white hover:bg-third text-white font-bold py-2 px-4 rounded"
                    >
                      Edit Profile
                      </a>
                  </Link>
                )
              }
            </div>
          </div>
        </div>
        <div>
          {post.map((p, index) => <Post key={index} user={user} post={post[index]} />)}
        </div>
      </div>
      <NewPost />
      <Followers userList={followersList} isOpen={openModal} onClick={() => setOpenModal(false)} />
    </div>
  )
}
