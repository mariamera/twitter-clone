import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import ReactLoading from "react-loading";
import { findUserPosts, findUserLikePost } from "../../helpers/queries";
import Post from "../Posts/Post";
import { UserType, PostType } from "../../helpers/types";

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
      let getPost: { [x: string]: any }[] = [];

      if (user.username && !post[tabIndex].data.length) {
        if (tabIndex === 0) {
          getPost = await findUserPosts(user.username); //TODO: change Any to correct type
        }
        if (tabIndex === 1) {
          getPost = await findUserPosts(user.username, true); //TODO: change Any to correct type
        }

        if (tabIndex === 3) {
          getPost = user.uid ? await findUserLikePost(user.uid) : []; //TODO: change Any to correct type
        }

        setPost((prev) => {
          prev[tabIndex].data = getPost;
          return [...prev];
        });
      }
    };

    void fetchUserData();
  }, [tabIndex, user.uid, user.username]);

  return (
    <div>
      <div>
        <Tab.Group
          onChange={(index) => {
            setTabIndex(index);
          }}
        >
          <Tab.List className="flex justify-around bg-white text-center">
            {TAB_LIST.map((category) => (
              <Tab
                key={category.name}
                className={({ selected }) =>
                  clsx(
                    "outline-transparent transition p-2 flex-auto hover:bg-third hover:text-white",
                    selected ? "border-b border-third font-bold" : ""
                  )
                }
              >
                {category.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {TAB_LIST.map((posts, index) => (
              <Tab.Panel
                key={index}
                className={clsx(
                  "bg-white rounded-xl p-3",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                )}
              >
                {posts.data.length ? (
                  posts.data.map((p : any) => {
                    if (p.post && p.user) {
                      return (
                        <Post key={p.post.postID} user={p.user} post={p.post} />
                      );
                    }

                    return <Post key={p.postID} user={user} post={p} />;
                  })
                ) : (
                  <ReactLoading
                    className="mx-auto"
                    type={"spin"}
                    color={"#000"}
                    height={"20%"}
                    width={"20%"}
                  />
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
