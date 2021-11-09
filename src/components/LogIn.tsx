import React, { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ErrorModal from './modal/ErrorModal';

export default function LogIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { currentUser, login } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!emailRef.current || !passwordRef.current) {
      setError('Missing fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      router.push('/home');
    }
    catch (error) {
      setError('Failed to log in!');
    }
  }

  if (currentUser) {
    router.push('/home');
    return (<></>);
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8">
        <h2>Log in</h2>
        <ErrorModal errorMsg={error} />
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
          </div>
          <div className="w-full pt-4">
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              Password
                      </label>
            <input
              type="password"
              ref={passwordRef}
              name="email-address"
              autoComplete="email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="w-full pt-4">
            <button className="block mx-auto bg-secondary text-white hover:bg-third font-bold py-2 px-4 border rounded" disabled={loading} type="submit">Log In</button>
            <Link href="/forgot-password">
              <a className="block text-center pt-4">Forgot Password?</a>
            </Link>
          </div>
        </form>
      </div>
      <div className="w-full text-center mt-2">
        <Link href="/signup">
          <a> Do not have an account? Sign up Here!</a>
        </Link>
      </div>
    </>
  )
}
