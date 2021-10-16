import clsx from 'clsx';
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext';
import Image from 'next/image';
import { DEFAULT_IMAGE } from '../../helpers/constants';
import { getCommentsFromPost } from '../../helpers/queries';
import Post from '../user/Post';


export default function Comments({postID}) {
  const [comments, setComments] = useState([]);

  useEffect(async () => {
    const commentsList = await getCommentsFromPost(postID);
    console.log("commentsList: ", commentsList);
    setComments(commentsList);
  }, [postID]);

  console.log("comments: ", comments);
    return (
    <div className={"relative mx-auto p-5 border rounded-md bg-white"}>
    {comments.map((p, index) => <Post key={index} user={p.user} post={p.post} />)}
    </div>
  )
}
