# React + saml認証サンプル

## 実行方法
  * ビルドを行う(yarn build)
  * saml-idpを起動する(yarn saml-idp)
  * react用サーバを起動する(yarn dev:server)
  * localhost:4000を開く
    * ログイン画面が表示されます。適当に入力するとReactAppのトップ画面が開きます

## saml-idpの設定方法について

### インストール
```
yarn add saml-idp
```
https://www.npmjs.com/package/saml-idp

### 秘密鍵と証明書を作成する
  * 国、都市名などは適宜入力してください。
  * 出力するファイル名は「saml-idp」のデフォルト名に合わせてあります
  * 作成したファイルを、プロジェクトのルートディレクトリに保存します
```
$ openssl req -x509 -new -newkey rsa:2048 -nodes  -keyout idp-private-key.pem -out idp-public-cert.pem -days 7300
Generating a RSA private key
.....+++++
......+++++
writing new private key to 'idp-private-key.pem'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:JP
State or Province Name (full name) [Some-State]:Aichi
Locality Name (eg, city) []:Oobu
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:Test Identity Provider
Email Address []:tkyk.niimura@gmail.com

```
### コマンドラインからidxサーバを起動するため、package.jsonにスクリプトを追加

```
  "saml-idp": "saml-idp --acs http://localhost:7000/auth/saml --aud mock-audience"
```
  * 上記でsaml-idpを起動することができます。

## アプリケーションの主な機能
* 何か始める際のボイラープレートとして、最低限必要な機能を実装
  * saml-idpパッケージを使い、saml認証でログインを行う
  * react-routerでページ切替
  * react-hook(useReducer)でアプリ全体のステートを管理する
  * ビルド後、アプリを起動するため＋api側のプロキシとしてserver(port:4000)を実装
    * serverはts-nodeを利用するため、事前コンパイル不要
  * eslintはAirbnb + αで設定
  * .envで環境変数を設定できるようにする。必須チェックあり。


## Available Scripts

このプロジェクトでは下記スクリプトが実行できます:

### `yarn server`
webサーバを起動
  * ビルド済みReactモジュールを返す
  * saml-idpに対して認証を行う
  * バックエンド(api)呼び出しのプロキシ
### `yarn dev:server`
開発用サーバを起動
### `yarn dev:react`
react用開発サーバを起動
### `yarn mock:api`
モック用APIサーバを起動(常にstatus:200を返す)
### `yarn test`
jestでユニットテストコードを実行
### `yarn build`
Reactアプリケーションをビルドする
### `yarn eject`
create-react-appの管理から抜け出す。
細かく設定を変更できるが、元に戻せない。

### `yarn lint`
lintを実行。airbnbを基本に下記設定を追加。
  * セミコロン必須
  * 行末スペースエラー
  * スペース、タブ混在不可
  * 改行はLF
  * trailing comma 必須
  * CamelCase必須


## warning "eslint-config-airbnb > eslint-config-airbnb-base@14.0.0" has unmet peer dependency "eslint-plugin-import
```
npx install-peerdeps --dev eslint-config-airbnb --yarn
```

## todo
* eslintrc.jsonを追加する✔
  * https://qiita.com/sprout2000/items/ee4fc97f83f45ba1d227
  * prettierも入れる✔
  * build, node_modulesを対象外にする✔
    ```json
    "ignorePatterns": ["build","node_modules"],
    ```
  * 下記警告を追加したいが後回し
    * インデントを合わせる警告・・・わからん後で
    * 無駄なスペースを警告✔
    * trailing comma 必須✔
    * セミコロン強制✔ arrow functionの定義
    * 変数や関数をキャメルケースにする
* serverフォルダを作る(port:4000)
  * ts-nodeを利用してコンパイル不要とする　✔
    ```typescript
    // React側のtsconfigとmodule形式が異なる(commonjs必須)ため、server用のtsconfigを読み込む
    const options = { transpileOnly: true, project:'./server/tsconfig.json' };
    require('ts-node').register(options);
    ```
  * reactビルド後のモジュールをserverから送ることができるようにする。✔
    ```typescript
    app.use(express.static(path.join(__dirname, '../build')));
    ```
  * /api へのアクセスをport:8080にリダイレクトする✔
    * 先にapiサーバのmockを作成し、全てのレスポンスに対してstatus:200を返すようにする✔
    * mockに対してアクセスを転送する(/authへのアクセス除く)
  * /auth でsaml認証を行えるように ✔
  * セッションクッキーがない場合は、認証ページ(idp)へ遷移させる✔
    * 全ページではなく、一部ページだけ認証を行うためにはどうすればよいのか？
* dotenv追加✔
  * ポート追加✔
  * config.tsを追加し、必須チェック✔
  * appConfgに設定を追加してexport✔
* react-routerを入れる✔
  * 他プロジェクトからコピーしてLintエラー修正✔
  * 各ページのURL直たたきしてもページが開くようにサーバ側で対応する✔
  * 未認証時、開くけど固定でトップページになる。うまくできないか？
* react-hookを入れる✔
  * 他プロジェクトからコピーしてLintエラー修正✔
  * saml認証で取得したユーザ情報をuseContextに保持する
* swagger.yamlを追加✔
  * mockサーバとして利用できるようにする ⇒ yamlに書いたサンプルをそのまま返してくれるmockがない ⇒ 保留
  * npm scriptとして追加する ⇒ 保留

