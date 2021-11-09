import React, { useState, useEffect } from 'react'
import Post from '../Posts/Post';
import { db } from '../../helpers/firebase';
import { getCommentsFromPost } from '../../helpers/queries';

type Props = {
  postID: string
}


interface comments {
  user: {},
  post: {}
}

export default function Comments({ postID }: Props) {
  const [comments, setComments] = useState<Array<comments>>([]);

  useEffect(() => {
    let unsubscribe: any;
  
    const getPostData = async () => {
      const postRef = await db.collection('posts').where("parentId", "==", postID);

      unsubscribe = postRef.onSnapshot(async data => {
        if (data.size) {
          const commentsList = await getCommentsFromPost(data.docs);

          setComments(commentsList);
        } else {
          setComments([]);
        }
      });
    };

    getPostData();


    return () => {
      console.log("unsubscribinggg")
      return unsubscribe();
    };

  }, [postID]);

  return (
    <div className={"relative mx-auto p-5 bg-white"}>
      {comments.map((p, index) => <Post key={index} user={p.user} post={p.post} />)}
    </div>
  )
}
