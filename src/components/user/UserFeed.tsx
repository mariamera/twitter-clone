import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import NewPost from '../modal/NewPost';
import { findUserPosts, startFollowing, stopFollowing, getUserId } from '../../helpers/queries';
import { useAuth } from '../../context/authContext';
import Post from './Post';
import { db } from '../../helpers/firebase';
import { DEFAULT_IMAGE } from '../../helpers/constants';

export default function UserFeed({ user }) {
  const [post, setPost] = useState([]);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(user.followers);
  const [following, setFollowing] = useState(user.following);
  const [connectionDocID, setFollowingDocID] = useState('');

  useEffect(async () => {
    const getPost = await findUserPosts(user.username);
    setPost(getPost);
  }, []);

  async function handleFollow() {
    setError('');
    try {
      if (isFollowing) {
        await stopFollowing(connectionDocID)
        setIsFollowing(false);
        setFollowers(v => v - 1);
      } else {
        await startFollowing(currentUser.uid, user.username);
        setIsFollowing(true)
        setFollowers(v => v + 1);
      }
    } catch (e) {
      setError('something wrong happened');
    }
  }

  useEffect(() => {
    if (user) {
      async function checkFollowing() {
        const uid = await getUserId(user.username);
        const result = await
          db
            .collection('follows')
            .where('followerId', '==', currentUser.uid)
            .where('followeeId', '==', uid.val())
            .get();

        if (result.size === 1) {
          setIsFollowing(true);
          setFollowingDocID(result.docs[0].id);
        }
      }

      checkFollowing();
    }
  }, [user]);

  return (
      <div className="w-full bg-primary">
        <div className="min-h-full h-44 bg-gradient-to-tl from-secondary"></div>
        <div className="md:w-3/4 md:mx-auto md:-my-8">
          <div className="p-8 flex flex-wrap md:flex-nowrap bg-white md:min-h-full">
            <div className="w-auto mx-auto -mb-12 transform -translate-y-1/2 md:-mb-20">
              <Image className="max-h-40 mx-auto rounded-full border-4 border-white"
                src={user.photoURL || DEFAULT_IMAGE}
                height="150"
                width="150"
              />
            </div>
            <div className="w-full md:w-auto md:flex md:items-end md:flex-wrap md:ml-auto transform mt-auto ">
              <h2 className="text-center mx-auto w-full text-2xl font-mono font-semibold tracking-tight">{user.displayName}</h2>
              <h3 className="text-center mx-auto w-full text-sm text-gray-400">{user.username}</h3>
              <div className="w-full flex justify-evenly">
                <p className="font-semibold">{followers} <span className="text-gray-500 front-normal">followers</span></p>
                <p className="font-semibold">{following} <span className="text-gray-500 front-normal">following</span></p>
              </div>
              <div>
                {currentUser.email !== user.email &&
                  (<button
                    className="block ml-auto mt-4 bg-secondary text-white hover:bg-third text-white font-bold py-2 px-4 rounded"
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>)}
              </div>
            </div>
          </div>
          <div>
            {post.map((p, index) => <Post key={index} user={user} post={post[index]} />)}
          </div>
        </div>
        <NewPost />
      </div>
  )
}
