import React, { useRef, useState } from 'react'
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { storage } from '../helpers/firebase';
import ErrorModal from './modal/ErrorModal';
import SuccessModal from './modal/SuccessModal';
import { DEFAULT_IMAGE } from '../helpers/constants';

export default function Profile() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { updateProfilePicture, updateUserProfile } = useAuth();
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

  function uploadImage(e) {
    setMessage('');
    setError('');

    const files = event.target.files;
    if (files.length === 1) {
      const file = files[0];
      const storageRef = storage.ref(currentUser.email + '/profilePicture/profilepic');
      return storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(async url => {
          if (url) {
            try {
              await updateProfilePicture(url);
              setMessage("Image uploaded successfully");
            } catch (e) {
              setError("ups something went wrong");
            }
          }
        })
      });
    }
  }

  function updateUserPro(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      updateUserProfile(diplayNameRef.current.value);
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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 w-full">
        <h2>Profile</h2>
        <ErrorModal errorMsg={error}/>
        <SuccessModal succMessage={message}/>
        <div className="flex">
          <div className="w-3/12">
            <div>
              <Image className="rounded-full mx-auto" src={currentUser.photoURL || DEFAULT_IMAGE} alt="Profile Picture" width="200" height="200" layout="responsive" />
              <button className="block p-4 mt-6 text-center border-2 border-dashed mx-auto" onClick={openFileWindow}>Upload Picture
              <input ref={getFile} type="file" onChange={uploadImage} className="invisible w-full hidden" multiple />
              </button>
            </div>
          </div>
          <div className="flex-auto p-6">
            <form method="POST" onSubmit={updateUserPro}>
              <div>{currentUser.email}</div>
              <div className="flex content-between">
                <div>Name:</div>
                <input ref={diplayNameRef} defaultValue={currentUser.displayName}/>
              </div>
              <div className="w-full">
                <button>Update Profile</button>
              </div>
            </form>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>

      </div>
    </>
  )
}
