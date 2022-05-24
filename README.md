開発時のメモ

- [Recoil](https://github.com/facebookexperimental/Recoil)を利用し、状態管理をしています。
  - 状態が変化すると、それに合わせ参照しているところが再描画されます。
- 認証情報の取得はクライアントからのリクエストにより取得可能です。（= SSR することにより cookie をもらうなどはしていない）
  - [サーバサイドレンダリングの導入から生じる SSRF | セキュリティブログ | 脆弱性診断（セキュリティ診断）の GMO サイバーセキュリティ by イエラエ](https://gmo-cybersecurity.com/blog/ssr-ssrf/)
