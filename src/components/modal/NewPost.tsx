import React, { useState } from "react";
import Image from "next/image";
import AddPost from "../inputs/AddPost";
import DefaultModal from "./DefaultModal";

export default function NewPost() {
  return (
    <DefaultModal
      title={
        <div className="fixed right-2 bottom-2">
          <Image src="/add.svg" height={30} width={30} alt="add new post" />
        </div>
      }
      current={"new post"}
    >
      <AddPost style="border-none" />
    </DefaultModal>
  );
}
