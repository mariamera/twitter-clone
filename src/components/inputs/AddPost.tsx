import clsx from 'clsx';
import React, { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import Avatar from '../Avatar/Avatar';

export default function AddPost({ children, style, onClick }) {
  const [disableBtn , setDisableBtn ] = useState(true);
  const postRef = useRef();
  const { currentUser, addPost } = useAuth();

  function createPost(e) {
    e.preventDefault();

    try {
      addPost(postRef.current.value);
      postRef.current.value = '';

      if ( onClick) onClick();
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <div className={clsx("relative mx-auto p-5 border rounded-md bg-white", style)}>
      <div className="relative flex justify-start">
        <div>
          <Avatar userPhoto={currentUser.photoURL}  altText={`your profile picture`}/>
        </div>
        <div className="flex-grow mx-8">
          {children}
          <form method="POST" onSubmit={createPost}>
            <textarea placeholder="What are you thinking about?" className="w-full" ref={postRef} maxLength={200} />
            <button type="submit" className="block ml-auto bg-secondary hover:bg-third  text-white font-bold py-2 px-4 rounded">Add Post</button>
          </form>
        </div>
      </div>
    </div>
  )
}
