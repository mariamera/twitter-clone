import React, { useState, useEffect } from 'react'
import { getCommentsFromPost } from '../../helpers/queries';
import Post from '../user/Post';


export default function Comments({postID}) {
  const [comments, setComments] = useState([]);

  useEffect(async () => {
    const commentsList = await getCommentsFromPost(postID);
    setComments(commentsList);
  }, []);

    return (
    <div className={"relative mx-auto p-5 border rounded-md bg-white"}>
    {comments.map((p, index) => <Post key={index} user={p.user} post={p.post} />)}
    </div>
  )
}
