import React, { useEffect, useState } from "react";
import Link from "next/link";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SettingsIcon from "@material-ui/icons/Settings";
import HomeIcon from "@material-ui/icons/Home";
import { useAuth } from "../context/AuthContext";
import { getUserInfoById } from "../helpers/queries";

export default function Menu() {
  const { currentUser } = useAuth();
  const [username, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userInformationRes = await getUserInfoById(currentUser?.uid);
      if (userInformationRes) {
        const userInformation = userInformationRes.val();

        if (userInformation && userInformation.username) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setUserName(userInformation.username);
        }
      }
    };

    void fetchUserData();
  }, [currentUser]);

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
            <Link href={`/${username}`}>
              <a className="flex aling-center">
                <PersonOutlineOutlinedIcon className="fill-current text-green-600 mr-2" />{" "}
                Profile
              </a>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <a className="flex aling-center">
                <SettingsIcon className="fill-current text-green-600 mr-2" />{" "}
                Settings
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
