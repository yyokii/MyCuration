## Set up

Firebase emulator

`firebase emulators:start --import=./emulators`

## Commands

- Import emulators settings

`firebase emulators:start --import=./emulators`

- Export emulators settings

`firebase emulators:export --force ./emulators`

- Check rendering options

`npx next build`

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
