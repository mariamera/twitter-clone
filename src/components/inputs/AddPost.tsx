import clsx from 'clsx';
import React, { useRef, useState } from 'react'
import { useAuth } from '../../context/authContext';
import Image from 'next/image';
import { DEFAULT_IMAGE } from '../../helpers/constants';

export default function AddPost({ children, style }) {
  const [disableBtn , setDisableBtn ] = useState(true);
  const postRef = useRef();
  const { currentUser, addPost } = useAuth();

  function createPost(e) {
    e.preventDefault();

    try {
      addPost(postRef.current.value);
      postRef.current.value = '';
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <div className={clsx("relative mx-auto p-5 border rounded-md bg-white", style)}>
      <div className="relative flex justify-start">
        <div>
          <Image src={currentUser.photoURL || DEFAULT_IMAGE} width={100} height={100} />
        </div>
        <div className="flex-grow mx-8">
          <h3>What are you thinking about?</h3>
          {children}
          <form method="POST" onSubmit={createPost}>
            <textarea className="w-full" ref={postRef} maxLength={200} />
            <button type="submit" className="block ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Post</button>
          </form>
        </div>
      </div>
    </div>
  )
}
