import { database, db } from './firebase';

async function findUserPosts(username) {
  let posts = [];
  let uid = await database.ref(`/usernames/${username}`).once('value', (snapshot) => (snapshot));
  const allPost = await db.collection("posts").where("uid", "==", uid.val()).orderBy('date', 'desc').get();

  // returns array of objects (tweets)
  return allPost ? allPost.docs.map(p => ({ ...p.data() })) : [];
}

async function getAllPost(followerList, pageSize, offsetDoc) {
  let postsArray = [];
  const posts = offsetDoc && offsetDoc.date ? await db.collection("posts").where("uid", "in", followerList).orderBy('date', 'desc').startAfter(offsetDoc.date).limit(pageSize).get()
    : await db.collection("posts").where("uid", "in", followerList).orderBy('date', 'desc').limit(pageSize).get();

  if (posts.docs) {
    postsArray = await posts.docs.reduce(async (prevValue, p) => {
      const accum = await prevValue;
      const currentPost = p.data();
      const user = await database.ref(`/users/${currentPost.uid}`).once('value', (snapshot) => (snapshot));

      accum.push({
        user: user.val(),
        post: currentPost
      })

      return accum;

    }, Promise.resolve([]));
  }

  return postsArray;

}

function subscribePost(followerList: Array<any>, pageSize: number) {
  return db.collection("posts").where("uid", "in", followerList).orderBy('date', 'desc').limit(pageSize)
}

async function getSinglePost(postId: string) {
  return db.collection('posts').where('postID', '==', postId).get();
}

async function getCommentsFromPost(postID: String) {
  let postsArray = [];
  const posts = await db.collection("posts").where("parentId", "==", postID).orderBy('date', 'desc').get();

  if (posts.docs) {
    postsArray = await posts.docs.reduce(async (prevValue, p) => {
      const accum = await prevValue;
      const currentPost = p.data();
      const user = await database.ref(`/users/${currentPost.uid}`).once('value', (snapshot) => (snapshot));

      accum.push({
        user: user.val(),
        post: currentPost
      })

      return accum;

    }, Promise.resolve([]));
  }

  return postsArray;
}

async function startFollowing(followerId: String, username: String) {
  const followeeId = await database.ref(`/usernames/${username}`).once('value', (snapshot) => (snapshot));

  return db.collection('follows').add({
    followerId,
    followeeId: followeeId.val()
  })
}

function addLike(postId, uid) {
  return db.collection('likes').add({
    postId,
    userid: uid
  })
}

async function checkPostLikes(postId) {
  return await db.collection('likes').where('postId', "==", postId).get();
}

async function userLikedPost(postId, uid) {
  const doc = await db.collection('likes').where('postId', "==", postId).where("userid", "==", uid).get();
  return doc.size;
}

function userDisLikedPost(likeId) {
  return db.collection('likes').doc(likeId).delete();
}

function stopFollowing(connectionId) {
  return db.collection('follows').doc(connectionId).delete();
}

async function getUserFollowers(uid: String) {
  return db.collection('follows').where("followeeId", "==", uid).get();
}

async function getUserFollowing(uid: String) {
  return db.collection('follows').where("followerId", "==", uid).get();
}

async function getUserInfoByUsername(username: String) {
  return await database.ref('users').orderByChild('username').equalTo(username).once('value', (snapshot) => (snapshot));
}

async function getUserInfoById(uid: String) {
  return await database.ref(`users/${uid}`).once('value', (snapshot) => (snapshot));
}

async function getUserId(username: String) {
  return await database.ref(`/usernames/${username}`).once('value', (snapshot) => (snapshot))
}

// Post queries
module.exports.findUserPosts = findUserPosts;
module.exports.getAllPost = getAllPost;
module.exports.subscribePost = subscribePost;
module.exports.getSinglePost = getSinglePost;
module.exports.addLike = addLike;
module.exports.checkPostLikes = checkPostLikes;
module.exports.userDisLikedPost = userDisLikedPost;
module.exports.userLikedPost = userLikedPost;
module.exports.getCommentsFromPost = getCommentsFromPost;

// Following Queries
module.exports.startFollowing = startFollowing;
module.exports.stopFollowing = stopFollowing;
module.exports.getUserFollowers = getUserFollowers;
module.exports.getUserFollowing = getUserFollowing;

//User Questies
module.exports.getUserInfoByUsername = getUserInfoByUsername;
module.exports.getUserInfoById = getUserInfoById;
module.exports.getUserId = getUserId;
