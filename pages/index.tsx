import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div >
      <Head>
        <title>Republica Queer Space</title>
        <meta name="description" content="Lo mas gay del mundo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="w-5/6 mx-auto">
          <h1 >
            Welcome to Republica Queers Social Media
        </h1>
          <Link href={`/signup`}>
            <a>Sign Up!</a>
          </Link>
          <Link href={`/login`}>
            <a>Log In!</a>
          </Link>
        </div>

      </main>
    </div>
  )
}

export default Home
