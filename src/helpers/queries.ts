import { database, db } from "./firebase";
import { POST_COLLECTION_NAME } from "./constants";

import { PostType, singlePostType } from "./types";

async function fetchUserAndPost(posts: firebase.firestore.DocumentData) {
  return await posts.docs.reduce(
    async (
      prevValue: Promise<PostType[]>,
      p: { data: () => singlePostType }
    ) => {
      const accum: PostType[] = await prevValue;
      const currentPost = p.data();

      const userAlreadyFetched = accum.find(
        (current: PostType) => current.user.uid === currentPost.uid
      );

      if (userAlreadyFetched) {
        accum.push({
          user: userAlreadyFetched.user,
          post: currentPost,
        });
      } else {
        const user = await getUserInfoById(currentPost.uid);

        accum.push({
          user: user ? { uid: user.key, ...user.val() } : {},
          post: currentPost,
        });
      }

      return accum;
    },
    Promise.resolve([])
  );
}
async function findUserPosts(username: string, withReplies: boolean = false) {
  const uid = await database
    .ref(`/usernames/${username}`)
    .once("value", (snapshot) => snapshot);
  const allPost = withReplies
    ? await db
        .collection(POST_COLLECTION_NAME)
        .where("uid", "==", uid.val())
        .orderBy("date", "desc")
        .get()
    : await db
        .collection(POST_COLLECTION_NAME)
        .where("uid", "==", uid.val())
        .where("parentId", "==", null)
        .orderBy("date", "desc")
        .get();

  return allPost.docs.map((p) => ({ ...p.data() }));
}

async function getAllPost(
  followerList: string[],
  pageSize: number,
  offsetDoc?: { date: number }
) {
  let postsArray: Array<PostType> = [];

  const posts =
    offsetDoc && offsetDoc.date
      ? await db
          .collection(POST_COLLECTION_NAME)
          .where("uid", "in", followerList)
          .orderBy("date", "desc")
          .startAfter(offsetDoc.date)
          .limit(pageSize)
          .get()
      : await db
          .collection(POST_COLLECTION_NAME)
          .where("uid", "in", followerList)
          .orderBy("date", "desc")
          .limit(pageSize)
          .get();

  if (posts.size) {
    postsArray = await fetchUserAndPost(posts);
  }

  return postsArray;
}

function subscribePost(followerList: Array<any>, pageSize: number) {
  return db
    .collection(POST_COLLECTION_NAME)
    .where("uid", "in", followerList)
    .orderBy("date", "desc")
    .limit(pageSize);
}

async function getSinglePost(postId: string) {
  return db
    .collection(POST_COLLECTION_NAME)
    .where("postID", "==", postId)
    .get();
}

async function getCommentsFromPost(
  postIDArray: firebase.firestore.DocumentData[]
) {
  let postsArray: Array<PostType> = [];

  if (postIDArray.length) {
    postsArray = await postIDArray.reduce(
      async (prevValue: Promise<PostType[]>, p) => {
        const accum: PostType[] = await prevValue;
        const currentPost = p.data() as singlePostType;
        const user = await database
          .ref(`/users/${currentPost.uid}`)
          .once("value", (snapshot) => snapshot);

        accum.push({
          user: { uid: user.key, ...user.val() },
          post: currentPost,
        });

        return accum;
      },
      Promise.resolve([])
    );
  }

  return postsArray;
}

async function startFollowing(followerId: string, followeeId: string) {
  return db.collection("follows").add({
    followerId,
    followeeId,
  });
}

function addLike(postId: string, uid: string) {
  return db.collection("likes").add({
    postId,
    userid: uid,
  });
}

async function checkPostLikes(postId: string) {
  return await db.collection("likes").where("postId", "==", postId).get();
}

async function checkPostComment(postId: string) {
  return await db
    .collection(POST_COLLECTION_NAME)
    .where("parentId", "==", postId)
    .get();
}

async function userLikedPost(postId: string, uid: string) {
  const doc = await db
    .collection("likes")
    .where("postId", "==", postId)
    .where("userid", "==", uid)
    .get();
  return doc.size;
}

function userDisLikedPost(likeId: string) {
  return db.collection("likes").doc(likeId).delete();
}

async function findUserLikePost(uid: string) {
  let postsArray: Array<PostType> = [];

  const ids = await db.collection("likes").where("userid", "==", uid).get();
  const podsIds = ids.docs.map((p) => p.data().postId);
  const postBatch = podsIds.slice(0, 10); //Todo: Update to use offset and loadmore

  const posts = await db
    .collection(POST_COLLECTION_NAME)
    .where("postID", "in", postBatch)
    .get();

  if (posts.size) {
    postsArray = await fetchUserAndPost(posts);
  }

  return postsArray;
}

function stopFollowing(connectionId: string) {
  return db.collection("follows").doc(connectionId).delete();
}

async function getUserFollowers(uid: string) {
  return db.collection("follows").where("followeeId", "==", uid).get();
}

async function getUserFollowing(uid: string) {
  return db.collection("follows").where("followerId", "==", uid).get();
}

async function getUserInfoByUsername(username: string) {
  return await database
    .ref("users")
    .orderByChild("username")
    .equalTo(username)
    .once("value", (snapshot) => snapshot);
}

async function getUserInfoById(uid: string | undefined) {
  return uid
    ? await database.ref(`users/${uid}`).once("value", (snapshot) => snapshot)
    : null;
}

export {
  //User Questies
  getUserInfoByUsername,
  getUserInfoById,
  // Post queries
  findUserPosts,
  getAllPost,
  subscribePost,
  getSinglePost,
  addLike,
  findUserLikePost,
  checkPostLikes,
  userDisLikedPost,
  userLikedPost,
  getCommentsFromPost,
  checkPostComment,
  // Following Queries
  startFollowing,
  stopFollowing,
  getUserFollowers,
  getUserFollowing,
};
