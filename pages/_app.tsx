import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../src/context/authContext';
// import { Provider } from 'react-redux'

import store from '../src/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      {/* <Provider store={store}> */}
        <Component {...pageProps} />
      {/* </Provider> */}
    </AuthProvider>
  )
}
export default MyApp
