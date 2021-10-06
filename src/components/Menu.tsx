import React, { useRef, useState } from 'react'
import { useAuth } from '../context/authContext';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Menu() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    router.push('/login');
    return (<></>);
  }

  return (
    <div className="w-full bg-white">
      <div className="flex justify-end items-center border-b-2 border-gray-100 py-6">
        <ul className="flex justify-evenly w-full">
          <li>
            <Link href="/home">
              <a>
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a>
                Profile
              </a>
            </Link>
          </li>
        </ul>

      </div>
    </div>
  )
}
