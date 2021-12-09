import { useState, useReducer, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addLike,
  checkPostLikes,
  userDisLikedPost,
  checkPostComment,
} from "../helpers/queries";

const initialState = {
  isLiked: false,
};

const UPDATE_LIKE = "updateLike";

const postInfoReducer = (state, action) => {
  if (action.type === UPDATE_LIKE) {
    return {
      isLiked: action.isLiked,
    };
  }
  return state;
};
export const usePostInfo = (postId: string) => {
  const [state, dispatch] = useReducer(postInfoReducer, initialState);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (postId) {
      return checkPostLikes(postId).then((like) => {
        const likeDocs = like.docs[0];

        const checkLike = like.docs.find((val) => {
          const user = val.data();
          return user.userid === currentUser!.uid;
        });

        dispatch({ type: UPDATE_LIKE, payload: { isLiked: !!checkLike } });
      });
    }
  }, []);
  return [state.isLiked, dispatch];
};
