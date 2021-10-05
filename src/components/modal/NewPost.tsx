import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/authContext';
import AddPost from '../inputs/AddPost';

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
          <AddPost style="top-20 w-8/12">
            <button className="absolute right-0 top-0" onClick={()=> setShowModal(false)}><Image src="/close.svg" height={15} width={15} /> </button>
          </AddPost>
          </div>
        )}
    </>
  )
}
