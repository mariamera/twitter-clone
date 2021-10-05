import React, { useEffect , useState} from "react";
import { getAllPost } from '../helpers/queries';

export function usePost(pageSize: number) {
  const [offset, setOffset] = useState();
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const followersSnapShot = await getAllPost(pageSize, offset);

    if (followersSnapShot.length) {
      setOffset(followersSnapShot[followersSnapShot.length - 1].post);
    }
  
    setPosts((prevState) => [...prevState, ...followersSnapShot]);
  };

  return [ posts, getPosts ];
}