import React, { useRef, useState } from 'react'
import { useAuth } from '../context/authContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ErrorModal from './modal/ErrorModal';

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const passwordConfirmationRef = useRef();
  const { signup, checkUsername } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    let isUsernameExist = await checkUsername(usernameRef.current.value);
    console.log("isUsernameExist: ", isUsernameExist)
    if (isUsernameExist) {
      setError('Username is already taken');
      return;
  }

    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value);
      setLoading(false);
      router.push('/home');
    }
    catch (error) {
      setError(`${error.message}`);
    }
  }
  return (
    <>
      <div className="w-full bg-white shadow overflow-hidden sm:rounded-lg p-8 max-h-[400px] md:w-3/4 md:m-8">
        <h2 className="font-sans text-2xl font-bold leading-7 text-gray-500 text-center">Sign up </h2>
        {error && <ErrorModal errorMsg={error} />}
        <form method="POST" className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="mt-4">
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
          </div>
          <div className="mt-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              ref={usernameRef}
              name="username"
              autoComplete="email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
                      </label>
            <input
              type="password"
              ref={passwordRef}
              name="password"
              autoComplete="email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password-confirmation" className="block text-sm font-medium text-gray-700">
              Password Confirmation
                      </label>
            <input
              type="password"
              ref={passwordConfirmationRef}
              name="password-confirmation"
              autoComplete="email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <button className="block mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading} type="submit">Sign Up</button>
          </div>
        </form>
      </div>
      <div className="w-full text-center mt-2">
        <Link href="login">
          <a className="text-gray-500"> Already have an account? <span className="text-blue-700"> Log In here </span></a>
        </Link>
      </div>
    </>
  )
}
