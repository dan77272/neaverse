import { ToggleProvider } from '@/ToggleContext'
import UserContextProvider from '@/UserContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <div>
      <UserContextProvider>
        <ToggleProvider>
          <Component {...pageProps} />
        </ToggleProvider>
      </UserContextProvider>
    </div>
  )
}
