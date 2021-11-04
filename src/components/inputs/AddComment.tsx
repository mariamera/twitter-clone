import React, { useRef } from 'react'
import { useAuth } from '../../context/authContext';
import Avatar from '../Avatar/Avatar';

export default function AddComment({ postID }) {
  const commentRef = useRef(null);
  const { currentUser, addReply } = useAuth();

  function postAnswer(e) {
    e.preventDefault()
    try {
      addReply(commentRef.current.value, postID);
      commentRef.current.value = '';
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <div className={"relative mx-auto p-5 border rounded-md bg-white"}>
      <div className="bg-white flex items-center">
        <div className="">
          <Avatar altText="your current profile picture" userPhoto={currentUser.photoURL} />
        </div>
        <div className="flex-auto">
          <form
            onSubmit={postAnswer}
            className="px-4">
            <input
              ref={commentRef}
              className="px-4 bg-gray-200 placeholder-gray-700 placeholder-opacity-70  rounded-lg h-12 w-full font-noto text-sm font-medium"
              type="text"
              placeholder="Tweet your Reply"
            />
            <button type="submit" className="mt-4 block ml-auto bg-secondary hover:bg-third  text-white font-bold py-2 px-4 rounded">
              Reply
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
