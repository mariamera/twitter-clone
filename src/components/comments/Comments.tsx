import React, { useState, useEffect } from 'react'
import Post from '../Posts/Post';
import { db } from '../../helpers/firebase';
import { getCommentsFromPost } from '../../helpers/queries';


export default function Comments({ postID }) {
  const [comments, setComments] = useState([]);

  useEffect(async () => {
    const postRef = await db.collection('posts').where("parentId", "==", postID);
    const unsubscribe = postRef.onSnapshot(async data => {
      if (data.size) {
        const commentsList = await getCommentsFromPost(data.docs);

        setComments(commentsList);
      }
    });

    return () => unsubscribe();

  }, []);

  return (
    <div className={"relative mx-auto p-5 bg-white"}>
      {comments.map((p, index) => <Post key={index} user={p.user} post={p.post} />)}
    </div>
  )
}
