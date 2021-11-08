import React, { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function UpdateProfile() {
  const emailRef = useRef();
  const [message, setMessage] = useState('');
  const { updateProfile } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage('');
      await updateProfile();
      setMessage('An email has been sent to your inbox, please check for further instructions')
    }
    catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8">
      <h2>Update Profile</h2>
      <button onClick={handleSubmit}
        className="block mx-auto my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700" 
        type="submit">Update Profile</button>
      {message && (<div>{message} </div>)}
    </div>
  )
}
