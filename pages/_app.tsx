import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../src/context/authContext';
import { PostProvider } from '../src/context/postContext';
// import { Provider } from 'react-redux'

import store from '../src/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PostProvider>
        <Component {...pageProps} />
      </PostProvider>
    </AuthProvider>
  )
}
export default MyApp
