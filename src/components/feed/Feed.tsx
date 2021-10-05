import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/router';
import NewPost from '../modal/NewPost';
import { usePost } from '../../hooks/usePosts';
import Post from '../user/Post';
import AddPost from '../inputs/AddPost';

export default function Feed() {
  const router = useRouter();
  const { posts, getPosts } = usePost(10);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef();

  useEffect(async () => {
    setLoading(true);
    await getPosts();
    setLoading(false);
  }, []);

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
      <div ref={bodyRef} className="w-full min-h-screen relative bg-primary pt-8">
        <div className="w-3/4 mx-auto">
          <AddPost />
          {posts && posts.map((p, index) => <Post key={index} user={p.user} date={p.post.date} text={p.post.text} />)}
        </div>
        {loading && (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        )}
        <NewPost />
        <button className="block mx-auto" onClick={loadMore}>Load More</button>
      </div>
    </>
  )
}
