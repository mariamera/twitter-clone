import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../src/context/authContext';
// import { Provider } from 'react-redux'

import store from '../src/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
export default MyApp
