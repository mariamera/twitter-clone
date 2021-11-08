import React, { useState } from 'react';
import DefaultModal from "./DefaultModal";

export default function Followers({ userList, isOpen , onClick}) {
  return (
    <DefaultModal isOpen={isOpen} onClick={onClick}>
      {userList.map((user, index) => <p key={index}>{user.displayName}</p>)}
    </DefaultModal>
  )
}
