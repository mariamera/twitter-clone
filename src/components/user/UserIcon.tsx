import Link from "next/link";
import React, { useState, useEffect } from "react";
import { UserType } from "../../helpers/types";
import Avatar from "../Avatar/Avatar";
import FollowButton from "./FollowButton";

type Props = {
  user: UserType;
};

export default function UserIcon({ user }: Props) {
  const username = user.username || 'nousername';
  return (
    <Link href={`/${username}`}>
      <a className="z-10 relative block">
        <div className="relative flex flex-wrap w-full p-4 hover:bg-gray-200">
          {" "}
          <div>
            <Avatar
              altText={`${username} profile picture`}
              userPhoto={user.photoURL}
            />
          </div>
          <div style={{ flex: "1 1 0" }} className="px-4 flex-grow-0">
            <div className="flex-auto">
              <h4 className="font-bold text-lg">
                {user.displayName}
                <span className="font-normal color-gray-400 text-sm px-1">
                  {username}
                </span>
              </h4>
            </div>
            <FollowButton user={user} />
          </div>
        </div>
      </a>
    </Link>
  );
}
