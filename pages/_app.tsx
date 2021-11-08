import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../src/context/AuthContext';
import { PostProvider } from '../src/context/PostContext';

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
