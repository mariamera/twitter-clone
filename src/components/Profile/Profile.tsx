import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router';
import { uploadImageToFirebase } from '../../helpers/images';
import ErrorModal from '../modal/ErrorModal';
import SuccessModal from '../modal/SuccessModal';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../context/PostContext';
import Avatar from '../Avatar/Avatar';

export default function Profile() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { resetPost } = usePost();
  const { updateProfilePicture, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const getFile = useRef<HTMLInputElement>(null);
  const diplayNameRef = useRef<HTMLInputElement>(null);


  async function handleLogout() {
    setError("")
    try {
      await logout();
      void router.push('/login');
    } catch (error) {
      setError("Failed to log out")
    }
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage('');
    setError('');

    const files = event.target.files;

    if (files && files.length === 1) {
      setLoading(true);
      const file = files[0];
      try {
        const url = await uploadImageToFirebase(currentUser!.uid, file);
        await updateProfilePicture(url);
        setMessage("Image uploaded successfully");
      } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        setError(errorMessage);
      }
    }
  }

  async function updateUserPro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!diplayNameRef.current) {
      setError('uppsss.. we encounter some issues with the name');

      return;
    }

    try {
      await updateUserProfile(diplayNameRef.current.value);
      await resetPost();
      setMessage('Information updated Successfully');
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    }
  }

  function openFileWindow() {
    if (getFile.current) {
      getFile.current.click();

    }
  }

  if (!currentUser) {
    void router.push('/login');
    return (<></>);
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 w-full font-serif lg:w-3/4 lg:mx-auto lg:mt-8">
        <h2 className="text-center text-2xl font-sans color-primary">Profile</h2>
        <ErrorModal errorMsg={error} />
        <SuccessModal succMessage={message} />
        <div className="flex">
          <div className="w-3/12">
            <div>
              <Avatar altText={`Your current profile picture`} userPhoto={currentUser.photoURL} size={{ height: "200", width: "200" }} />
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
                <input className="block border border-gray-400 rounded-md px-4" ref={diplayNameRef} defaultValue={currentUser.displayName || ''} />
              </div>
              <div className="w-full">
                <button className="block my-4 bg-secondary text-white hover:bg-third text-white font-bold py-2 px-4 border border-secondary">Update Profile</button>
              </div>
            </form>
            <button className="uppercase text-sm text-secondary hover:underline leading-relaxed" onClick={handleLogout}>Log Out</button>
          </div>
        </div>

      </div>
    </>
  )
}
