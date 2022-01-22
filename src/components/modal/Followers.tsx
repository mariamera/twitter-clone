import React from "react";
import UserIcon from "../user/UserIcon";
import DefaultModal from "./DefaultModal";

type Props = {
  userList: Array<firebase.User>;
  isOpen: boolean;
  onClick: () => void;
};

export default function Followers({ userList, isOpen, onClick }: Props) {
  console.log("userList: ", userList);
  return (
    <DefaultModal>
      {userList.map((user) => (
        <UserIcon key={user.email} user={user} />
      ))}
    </DefaultModal>
  );
}
