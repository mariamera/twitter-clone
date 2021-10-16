import {
  storage
} from './firebase';


async function uploadImageToFirebase(userEmail, file) {
  const storageRef = storage.ref(userEmail + '/profilePicture/profilepic');
  const ref = await storageRef.put(file);
  const url = await ref.ref.getDownloadURL();

  return url;
}

module.exports.uploadImageToFirebase = uploadImageToFirebase;