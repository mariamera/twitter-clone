import { database, db } from './firebase';

async function findUserPosts(username) {
  let posts = [];
  let uid = await database.ref(`/usernames/${username}`).once('value', (snapshot) => (snapshot));
  const allPost = await db.collection("posts").where("uid", "==", uid.val()).orderBy('date', 'desc').get();

  // returns array of objects (tweets)
  return allPost ? allPost.docs.map(p => ({ ...p.data() })) : [];
}

async function getAllPost(pageSize, offsetDoc) {
  let postsArray = [];
  const posts = offsetDoc && offsetDoc.date ? await db.collection("posts").orderBy('date', 'desc').startAfter(offsetDoc.date).limit(pageSize).get()
    : await db.collection("posts").orderBy('date', 'desc').limit(pageSize).get();

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

function stopFollowing(connectionId) {
  return db.collection('follows').doc(connectionId).delete();
}

async function getUserFollowers(username: String) {
  const followeeId = await database.ref(`/usernames/${username}`).once('value', (snapshot) => (snapshot));

  return db.collection('follows').where("followeeId", "==", followeeId.val()).get();
}

async function getUserInfo(username: String) {
  return await database.ref('users').orderByChild('username').equalTo(username).once('value', (snapshot) => (snapshot));
}

async function getUserId(username: String) {
  return await database.ref(`/usernames/${username}`).once('value', (snapshot) => (snapshot))
}


module.exports.findUserPosts = findUserPosts;
module.exports.getAllPost = getAllPost;
module.exports.startFollowing = startFollowing;
module.exports.stopFollowing = stopFollowing;
module.exports.getUserFollowers = getUserFollowers;
module.exports.getUserInfo = getUserInfo;
module.exports.getUserId = getUserId;
