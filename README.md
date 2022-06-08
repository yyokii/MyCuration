## 開発メモ

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

## エラーや警告

- [[SSR][NextJS] Duplicate atom key during development and during production build in nextjs](https://github.com/facebookexperimental/Recoil/issues/733)
  - Recoil の問題で、HMR 環境の場合でエラーが生じている
