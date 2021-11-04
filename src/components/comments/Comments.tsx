import React, { useState, useEffect } from 'react'
import Post from '../Posts/Post';
import { usePost } from '../../context/postContext';


export default function Comments({postID}) {
  const [comments, setComments] = useState([]);
  const { getComments } = usePost();

  useEffect(async () => {
    const commentsList = await getComments(postID);
    setComments(commentsList);
  }, []);

    return (
    <div className={"relative mx-auto p-5 border rounded-md bg-white"}>
    {comments.map((p, index) => <Post key={index} user={p.user} post={p.post} />)}
    </div>
  )
}
