import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image'
import { uploadImageToFirebase } from '../../helpers/images';
import ErrorModal from '../modal/ErrorModal';
import SuccessModal from '../modal/SuccessModal';
import { useAuth } from '../../context/authContext';
import { usePost } from '../../context/postContext';
import { DEFAULT_IMAGE } from '../../helpers/constants';

export default function Profile() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { resetPost } = usePost();
  const { updateProfilePicture, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const getFile = useRef();
  const diplayNameRef = useRef();


  async function handleLogout() {
    setError("")
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      setError("Failed to log out")
    }
  }

  async function uploadImage(e) {
    setMessage('');
    setError('');

    const files = event.target.files;
    if (files.length === 1) {
      setLoading(true);
      const file = files[0];
      try {
        const url = await uploadImageToFirebase(currentUser.email, file);
        await updateProfilePicture(url);
        setMessage("Image uploaded successfully");

      } catch (error) {
        // setError(error);
      }
    }
  }

  async function updateUserPro(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await updateUserProfile(diplayNameRef.current.value);
      await resetPost();
      setMessage('Information updated Successfully');
    } catch (error) {
      setError(error);
    }
  }
  function openFileWindow() {
    getFile.current.click();
  }

  if (!currentUser) {
    router.push('/login');
    return (<></>);
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 w-full font-serif">
        <h2>Profile</h2>
        <ErrorModal errorMsg={error} />
        <SuccessModal succMessage={message} />
        <div className="flex">
          <div className="w-3/12">
            <div>
              <Image className="rounded-full mx-auto" src={currentUser.photoURL || DEFAULT_IMAGE} alt="Profile Picture" width="200" height="200" layout="responsive" />
              <button className="block p-4 mt-6 text-center border-2 border-dashed mx-auto" onClick={openFileWindow}>Upload Picture
              <input ref={getFile} type="file" onChange={uploadImage} className="invisible w-full hidden" multiple />
              </button>
            </div>
          </div>
          <div className="flex-auto p-6 leading-loose">
            <form method="POST" onSubmit={updateUserPro}>
              <div>Email:</div>
              <div>{currentUser.email}</div>
              <div className="">
                <div>Display Name:</div>
                <input className="block border border-gray-400 rounded-md px-4" ref={diplayNameRef} defaultValue={currentUser.displayName} />
              </div>
              <div className="w-full">
                <button className="block mx-auto my-4 bg-secondary text-white hover:bg-third text-white font-bold py-2 px-4 border border-secondary">Update Profile</button>
              </div>
            </form>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>

      </div>
    </>
  )
}
