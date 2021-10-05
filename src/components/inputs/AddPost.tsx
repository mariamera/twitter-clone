import React, { useRef } from 'react'
import { useAuth } from '../../context/authContext';

export default function AddPost() {
  const postRef = useRef();
  const { addPost } = useAuth();

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
    <div className="relative mx-auto p-5 border rounded-md bg-white">
      <div className="relative flex justify-between">
        <h3>What are you thinking about?</h3>
      </div>
      <form method="POST" onSubmit={createPost}>
        <textarea className="w-full" ref={postRef} maxLength={200} />

        <button type="submit" className="block mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Post</button>
      </form>
    </div>
  )
}
