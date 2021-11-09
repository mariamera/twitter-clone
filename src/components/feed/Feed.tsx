import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import NewPost from '../modal/NewPost';
import useOnScreen from '../../hooks/useOnScreen';
import Post from '../Posts/Post';
import AddPost from '../inputs/AddPost';
import { usePost } from '../../context/PostContext';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Feed() {
  const { currentUser } = useAuth();
  const { posts, getPosts } = usePost();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef();

  if (!currentUser) {
    router.push('/login');

    return (<></>);
  }

  async function loadMore() {
    setLoading(true);
    await getPosts();
    setLoading(false);
  }

  return (
    <>
      <div ref={bodyRef} className="w-full relative bg-primary pt-8">
        <div className="w-3/4 mx-auto">
          <AddPost />
          {posts && posts.map((p, index) => <Post key={index} user={p.user} post={p.post} showParentText />)}
        </div>
        {loading && (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        )}
        <NewPost />
        <button className="block mx-auto my-6" onClick={loadMore}>Load More</button>
      </div>
    </>
  )
}
