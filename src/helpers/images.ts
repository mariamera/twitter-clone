import {
  storage
} from './firebase';


async function uploadImageToFirebase(uid: string, file: File) : Promise<string> {
  const storageRef = storage.ref(`${uid}/profilePicture/profilepic`);
  const ref = await storageRef.put(file);
  const url = await ref.ref.getDownloadURL();

  return url;
}

export {
  uploadImageToFirebase
}
