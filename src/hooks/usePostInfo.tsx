import { useReducer, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { checkPostLikes } from "../helpers/queries";

type stateType = {
  isLiked: boolean | undefined;
  numLikes: number;
  docId: string | null;
};

const initialState = {
  isLiked: false,
  numLikes: 0,
  docId: "",
} as stateType;

const UPDATE_LIKE = "updateLike";

const postInfoReducer = (
  state: any,
  action: {
    type: string;
    payload: stateType;
  }
) => {
  if (action.type === UPDATE_LIKE) {
    return {
      isLiked: action.payload.isLiked,
      numLikes: action.payload.numLikes,
      docId: action.payload.docId,
    };
  }
  return state;
};
export const usePostInfo = (postId: string) => {
  const [state, dispatch] = useReducer(postInfoReducer, initialState);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const like = await checkPostLikes(postId);
        const likeDocs = like.docs[0] || {};

        if (!likeDocs.id) {
          return;
        }

        const checkLike = like.docs.find((val) => {
          const user = val.data();
          return user.userid === currentUser!.uid;
        });

        dispatch({
          type: UPDATE_LIKE,
          payload: {
            isLiked: checkLike && checkLike.exists,
            numLikes: like.size,
            docId: likeDocs.id || null,
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

  return [state.isLiked, state.numLikes, state.docId, dispatch] as [
    boolean,
    number,
    string,
    any
  ];
};
