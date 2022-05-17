import { RecoilRoot } from 'recoil'
import '../lib/firebase'
import '../hooks/authentication'
import '../styles/globals.scss'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

// TODO: 将来必要に応じて変更する
dayjs.locale('ja')

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
