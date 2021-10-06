import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/router';
import NewPost from '../modal/NewPost';
import { usePost } from '../../hooks/usePosts';
import useOnScreen from '../../hooks/useOnScreen';
import Post from '../user/Post';
import AddPost from '../inputs/AddPost';

export default function Feed() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [ posts, getPosts ] = usePost(10);
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef();
  const [ isVisible, currentElement ] = useOnScreen<HTMLDivElement>(100)

  useEffect(() => {
    loadMore();
  }, [isVisible]);

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
          {posts && posts.map((p, index) => <Post key={index} user={p.user} post={p.post} />)}
        </div>
        {loading && (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        )}
        <NewPost />
        <button ref={currentElement} className="block mx-auto" onClick={loadMore}>Load More</button>
      </div>
    </>
  )
}
