import {
  storage
} from './firebase';


async function uploadImageToFirebase(uid, file) {
  const storageRef = storage.ref(uid + '/profilePicture/profilepic');
  const ref = await storageRef.put(file);
  const url = await ref.ref.getDownloadURL();

  return url;
}

module.exports.uploadImageToFirebase = uploadImageToFirebase;