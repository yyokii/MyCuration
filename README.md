

Vercelで最新のnode-canvasが動作せず、canvas@2.6.1で固定してinstallしている。

```
yarn add canvas@2.6.1
```

また、その際にエラーが発生するので事前に下記を実行している
https://github.com/Automattic/node-canvas/issues/1733#issuecomment-761703018

```
brew install pkg-config cairo pango libpng jpeg giflib librsvg
brew doctor
```