import React from 'react';
import DefaultModal from "./DefaultModal";

type Props = {
  userList: Array<firebase.User>,
  isOpen: boolean,
  onClick: () => void
};

export default function Followers({ userList, isOpen , onClick}: Props) {
  return (
    <DefaultModal isOpen={isOpen} onClick={onClick}>
      {userList.map((user, index) => <p key={index}>{user.displayName}</p>)}
    </DefaultModal>
  )
}
