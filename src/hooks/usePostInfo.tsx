import { useReducer, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { checkPostLikes } from "../helpers/queries";

interface stateType {
  isLiked: boolean;
  numLikes: number;
  docId: string;
}

const initialState : stateType = {
  isLiked: false,
  numLikes: 0,
  docId: "",
};

const UPDATE_LIKE = "updateLike";

const postInfoReducer = (state, action) => {
  if (action.type === UPDATE_LIKE) {
    return {
      isLiked: action.payload.isLiked,
      numLikes: action.payload.numLikes,
      docId: action.payload.docId,
    } as stateType;
  }
  return state;
};
export const usePostInfo = (postId: string) => {
  const [state, dispatch]: [stateType, any] = useReducer(
    postInfoReducer,
    initialState
  );
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const like = await checkPostLikes(postId);
        const likeDocs = like.docs[0];

        const checkLike = like.docs.find((val) => {
          const user = val.data();
          return user.userid === currentUser!.uid;
        });

        dispatch({
          type: UPDATE_LIKE,
          payload: {
            isLiked: checkLike && checkLike.exists,
            numLikes: like.size,
            docId: likeDocs.id,
          },
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    if (postId) {
      void fetchData();
    }
  }, [postId, currentUser]);

  return [state.isLiked, state.numLikes, state.docId, dispatch];
};
