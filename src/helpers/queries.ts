import { database, db } from './firebase';
import { POST_COLLECTION_NAME } from './constants';

import { PostType, singlePostType } from "./types";

async function findUserPosts(username: string) {
  const uid = await database.ref(`/usernames/${username}`).once('value', (snapshot) => (snapshot));
  const allPost = await db.collection(POST_COLLECTION_NAME).where("uid", "==", uid.val()).where("parentId", "==", null).orderBy('date', 'desc').get();

  return allPost.docs.map(p => ({ ...p.data() }));
}

async function getAllPost(followerList: string[], pageSize: number, offsetDoc?: { date: number }) {
  let postsArray: Array<PostType> = [];

  const posts = offsetDoc && offsetDoc.date ? await db.collection(POST_COLLECTION_NAME).where("uid", "in", followerList).orderBy('date', 'desc').startAfter(offsetDoc.date).limit(pageSize).get()
    : await db.collection(POST_COLLECTION_NAME).where("uid", "in", followerList).orderBy('date', 'desc').limit(pageSize).get();

  if (posts.size) {
    postsArray = await posts.docs.reduce(async (prevValue: Promise<PostType[]>, p) => {
      const accum: PostType[] = await prevValue;
      const currentPost = p.data() as singlePostType;

      const userAlreadyFetched = accum.find((current: PostType) => current.user.uid === currentPost.uid);

      if (userAlreadyFetched) {
        accum.push({
          user: userAlreadyFetched.user,
          post: currentPost
        })
      } else {
        const user = await getUserInfoById(currentPost.uid)

        accum.push({
          user: { uid: user.key, ...user.val() },
          post: currentPost
        })
      }

      return accum;

    }, Promise.resolve([]));
  }

  return postsArray;

}

function subscribePost(followerList: Array<any>, pageSize: number) {
  return db.collection(POST_COLLECTION_NAME).where("uid", "in", followerList).orderBy('date', 'desc').limit(pageSize)
}

async function getSinglePost(postId: string) {
  return db.collection(POST_COLLECTION_NAME).where('postID', '==', postId).get();
}

async function getCommentsFromPost(postIDArray: firebase.firestore.DocumentData[]) {
  let postsArray: Array<PostType> = [];

  if (postIDArray.length) {
    postsArray = await postIDArray.reduce(async (prevValue: Promise<PostType[]>, p) => {
      const accum: PostType[] = await prevValue;
      const currentPost = p.data() as singlePostType;
      const user = await database.ref(`/users/${currentPost.uid}`).once('value', (snapshot) => (snapshot));

      accum.push({
        user: { uid: user.key, ...user.val() },
        post: currentPost
      })

      return accum;

    }, Promise.resolve([]));
  }

  return postsArray;
}

async function startFollowing(followerId: string, followeeId: string) {
  return db.collection('follows').add({
    followerId,
    followeeId
  })
}

function addLike(postId: string, uid: string) {
  return db.collection('likes').add({
    postId,
    userid: uid
  })
}

async function checkPostLikes(postId: string) {
  return await db.collection('likes').where('postId', "==", postId).get();
}

async function checkPostComment(postId: string) {
  return await db.collection(POST_COLLECTION_NAME).where('parentId', "==", postId).get();
}


async function userLikedPost(postId: string, uid: string) {
  const doc = await db.collection('likes').where('postId', "==", postId).where("userid", "==", uid).get();
  return doc.size;
}

function userDisLikedPost(likeId: string) {
  return db.collection('likes').doc(likeId).delete();
}

function stopFollowing(connectionId: string) {
  return db.collection('follows').doc(connectionId).delete();
}

async function getUserFollowers(uid: string) {
  return db.collection('follows').where("followeeId", "==", uid).get();
}

async function getUserFollowing(uid: string) {
  return db.collection('follows').where("followerId", "==", uid).get();
}

async function getUserInfoByUsername(username: string) {
  return await database.ref('users').orderByChild('username').equalTo(username).once('value', (snapshot) => (snapshot));
}

async function getUserInfoById(uid: string) {
  return await database.ref(`users/${uid}`).once('value', (snapshot) => (snapshot));
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

