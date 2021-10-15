import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div >
      <Head>
        <title>Feminismo</title>
        <meta name="description" content="Lo mas feminista del mundo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-primary h-screen font-serif">
        <div className="w-1/2 h-full ml-auto bg-secondary text-white flex flex-col justify-center">
          <div className="mx-auto">
            <h1 className>
              Feminismo!
          </h1>
            <Link href={`/signup`}>
              <a>Sign Up!</a>
            </Link>
            <Link href={`/login`}>
              <a>Log In!</a>
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}

export default Home
