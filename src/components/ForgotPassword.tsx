import React, { useRef, useState } from 'react'
import { useAuth } from '../context/authContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const emailRef = useRef();
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage('');
      await resetPassword(emailRef.current.value);
      setMessage('An email has been sent to your inbox, please check for further instructions')
    }
    catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8">
        <h2>Reset Password</h2>
        <form method="POST" className="flex flex-wrap" onSubmit={handleSubmit}>
          <div className="w-full pt-4">
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              Email address
                      </label>
            <input
              type="email"
              ref={emailRef}
              name="email-address"
              autoComplete="email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            <button className="block mx-auto my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700" type="submit">Reset Password</button>
          </div>
        </form>
        {message && (<div>{ message } </div>)}
      </div>
    </>
  )
}
