import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import HomeIcon from '@material-ui/icons/Home';

export default function Menu() {
  const router = useRouter();

  return (
    <div className="w-full bg-white">
      <div className="flex justify-end items-center border-b-2 border-gray-100 py-6">
        <ul className="flex justify-evenly w-full">
          <li>
            <Link href="/home">
              <a className="flex aling-center">
              <HomeIcon className="fill-current text-green-600 mr-2" />
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/home">
              <a className="flex aling-center">
              <NotificationsNoneIcon className="fill-current text-green-600 mr-2" />
                Notifications
              </a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a className="flex aling-center">
               <PersonOutlineOutlinedIcon className="fill-current text-green-600 mr-2" /> Profile
              </a>
            </Link>
          </li>
        </ul>

      </div>
    </div>
  )
}
