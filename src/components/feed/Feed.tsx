import React, { useState } from 'react'
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAuth } from '../../context/AuthContext';
import NewPost from '../modal/NewPost';
import Post from '../Posts/Post';
import AddPost from '../inputs/AddPost';
import { usePost } from '../../context/PostContext';

import { PostType } from "../../helpers/types";


export default function Feed() {
  const { currentUser } = useAuth();
  const { posts, getPosts } = usePost();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    void router.push('/login');

    return (<></>);
  }

  function loadMore(): void {
    try {
      setLoading(true);
      getPosts();
      setLoading(false);
    } catch (e) {
      console.log("something went wrong")
    }
  }

  return (
    <>
      <div className="w-full relative bg-primary pt-8">
        <div className="w-3/4 mx-auto">
          <AddPost />
          {posts.map((post: PostType, index: number) => <Post key={index} user={post.user} post={post.post} showParentText />)}
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
