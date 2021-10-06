import React, { useRef, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { DEFAULT_IMAGE } from '../../helpers/constants';

export default function Post({ user, post}) {
  function setDate(timestamp) {
    var date = new Date(timestamp);

    return date.toLocaleString();
  }

  return (
    <>
      <Link href={`/${user.username}/status/${post.postID}`}>
        <a>
          <div className="flex flex-wrap w-full p-4 my-2 border border-gray-200 rounded-lg hover:bg-gray-200 bg-white">
            <div>
              <Image className="rounded-full border-white" src={user.photoURL || DEFAULT_IMAGE} height="75" width="75" alt={`${user.username} profile picture`} />
            </div>
            <div className="px-4">
              <Link href={`/${user.username}`}>
                <a>
                  <h4 className="font-bold text-lg">{user.displayName} <span className="font-normal color-gray-400 text-sm">{user.username}</span></h4>
                </a>
               </Link>
             <span>{setDate(post.date)}</span>
              <div className="w-full">
                {post.text}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </>
  )
}
