import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/authContext';

export default function NewPost() {
  const [showModal, setShowModal] = useState(false);
  const postRef = useRef();
  const { addPost} = useAuth();

  function openModal() {
    setShowModal(true)
  }

  function createPost(e) {
    e.preventDefault();

    try {
      addPost(postRef.current.value);
      setShowModal(false);
    } catch (error) {
      console.log("error: ", error);
      setShowModal(false);
    }
  }

  return (
    <>
      <div className="fixed right-2 bottom-2">
        <button onClick={openModal}>
          <Image src="/add.svg" height={30} width={30} />
        </button>
      </div>
      {showModal &&
        (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="relative flex justify-between">
                <h3>What are you thinking about?</h3>
                <button onClick={()=> setShowModal(false)}><Image src="/close.svg" height={15} width={15} /> </button>
              </div>
              <form method="POST" onSubmit={createPost}>
                <textarea className="w-full" ref={postRef} maxLength="200" />
                <button type="submit" className="block mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Post</button>
              </form>
            </div>
          </div>
        )}
    </>
  )
}
