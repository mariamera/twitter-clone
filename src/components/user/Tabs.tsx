import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { findUserPosts, findUserLikePost } from "../../helpers/queries";
import Post from "../Posts/Post";
import { UserType } from "../../helpers/types";

const TAB_LIST = [
  {
    name: "Posts",
    data: [],
    offset: 0,
  },
  {
    name: "Posts & replies",
    data: [],
    offset: 0,
  },
  {
    name: "Media",
    data: [],
    offset: 0,
  },
  {
    name: "Likes",
    data: [],
    offset: 0,
  },
];

type Props = {
  user: UserType;
};

export default function Tabs({ user }: Props) {
  const [tabIndex, setTabIndex] = useState(0);
  const [post, setPost] = useState<Array<any>>(TAB_LIST);

  useEffect(() => {
    const fetchUserData = async () => {

      if (user.username && !post[tabIndex].data.length ) {
        console.log("----> post[tabIndex].data: ", post[tabIndex].data.length);

        let getPost = [];
        if (tabIndex === 0) {
          getPost = await findUserPosts(user.username); //TODO: change Any to correct type
        }
        if (tabIndex === 1 ) {
          getPost = await findUserPosts(user.username, true); //TODO: change Any to correct type
        }

        if (tabIndex === 3 ) {
          getPost = await findUserLikePost(user.uid); //TODO: change Any to correct type
        }

        setPost((prev) => {
          prev[tabIndex].data = getPost;

          return [...prev];
        });
      }
    };

    void fetchUserData();
  }, [tabIndex, user.uid, user.username]);

  console.log("post: ", post);
  return (
    <div>
      <div>
        <ul className="flex justify-around bg-white text-center">
          {TAB_LIST.map((tabData, index) => (
            <li
              key={index}
              onClick={() => setTabIndex(index)}
              className={clsx(
                "transition p-2 flex-auto hover:bg-third hover:text-white",
                index === tabIndex && "border-b border-third font-bold"
              )}
            >
              {tabData.name}
            </li>
          ))}
        </ul>
      </div>
      {post[tabIndex] &&
        post[tabIndex].data.map((p) => {
          if (p.post && p.user) {
            return <Post key={p.post.postID} user={p.user} post={p.post} />;
          }

          return <Post key={p.postID} user={user} post={p} />;
        })}
    </div>
  );
}
