# MyCuration

This is a Web App that saves URLs and comments.

<img src="https://user-images.githubusercontent.com/20992687/217567009-facf33e3-cae3-4451-a405-f76cc390cd8d.png" width="700">

The main functions are as follows

* Google Login
* Create/update/delete posts
* Tagging of posts
* Filtering of posts

## Tech stack

### Client
* Next.js
* Chakra UI
* Recoil

### Server
* Vercel
* Firebase Auth
  * If we use `signInWithRedirect`, additional changes are required because it does not behave properly in browsers other than chrome.[Best practices for using signInWithRedirect on browsers that block third-party storage access  |  Firebase](https://firebase.google.com/docs/auth/web/redirect-best-practices)
[Firebase Auth `getRedirectResult` is always null when I run the app in Safari - Stack Overflow](https://stackoverflow.com/a/75349931/9015472)
* Firestore
* Cloud Functions

## Set up

Start firebase emulator

`yarn run emulator`

This command compiles Funcitons and starts firebase emulator.

## Deploy

`yarn run deploy`

## Other Commands

- Import emulators settings

`firebase emulators:start --import=./emulators`

- Export emulators settings

`firebase emulators:export --force ./emulators`

- Check rendering options

`npx next build`

## env sample

```
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=

FIRESTORE_EMULATOR_HOST=
FIREBASE_AUTH_EMULATOR_HOST=

API_URL=
```

## Development tips

- [React の StrictMode](https://nextjs-ja-translation-docs.vercel.app/docs/api-reference/next.config.js/react-strict-mode)を on にしている
  - それ故に開発時は関数コンポーネントが 2 回呼び出されるなどの事象をわざと生じさせている
- React の主な再レンダリングタイミング
  - state の更新時
  - props の更新時
  - 親コンポーネントが再描画時
- [Recoil](https://github.com/facebookexperimental/Recoil)を利用し、状態管理をしている
  - 状態が変化すると、それに合わせ参照しているところが再描画される
- 認証情報の取得はクライアントからのリクエストにより取得可能（= SSR することにより cookie をもらうなどはしていない）
  - [サーバサイドレンダリングの導入から生じる SSRF | セキュリティブログ | 脆弱性診断（セキュリティ診断）の GMO サイバーセキュリティ by イエラエ](https://gmo-cybersecurity.com/blog/ssr-ssrf/)
- Firebase の Emulator を利用
  - [java](https://www.azul.com/downloads/?os=macos&architecture=arm-64-bit&package=jdk)をインストール
- spread-attributes: TSX でのオブジェクトの展開
  - https://ja.reactjs.org/docs/jsx-in-depth.html#spread-attributes
- null と undefined の判別について
  - > == null を使って undefined と null を両方ともチェックすることを推奨します。一般的に 2 つを区別する必要はありません。
  - https://typescript-jp.gitbook.io/deep-dive/recap/null-undefined
- Firebase Emulator の Port を変更した際に、現在の Emulator の情報が更新されない場合
  - 以前の Port を kill すれば期待通りに動くはず
  - もしくは現在と同じ Port を利用する
  - 関連コマンド
    - Port の利用状況確認: `lsof -i:{port number}`}`
      - lsof = list of open files
    - 特定 pid のプロセスを kill する: `kill {pid}`

## Error and Warning

- [[SSR][NextJS] Duplicate atom key during development and during production build in nextjs](https://github.com/facebookexperimental/Recoil/issues/733)
  - Recoil の問題で、HMR 環境の場合でエラーが生じている
