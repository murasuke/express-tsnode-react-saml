# ReactAppとそれをhostするexpressアプリサンプル
* 何か始める際のボイラープレートとして、最低限必要な機能を実装
  * react-routerでページ切替
  * react-hook(useReducer)でアプリ全体のステートを管理する
  * ビルド後、アプリを起動するため＋api側のプロキシとしてserver(port:4000)を実装
    * serverはts-nodeを利用するため、事前コンパイル不要
  * eslintはAirbnb + αで設定
  * .envで環境変数を設定できるようにする。必須チェックあり。

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
  * /auth でsaml認証を行えるように ⇒ 別リポジトリにする
  * セッションクッキーがない場合は、認証ページ(idp)へ遷移させる
    * 全ページではなく、一部ページだけ認証を行うためにはどうすればよいのか？
* dotenv追加✔
  * ポート追加✔
  * config.tsを追加し、必須チェック✔
  * appConfgに設定を追加してexport✔
* react-routerを入れる✔
  * 他プロジェクトからコピーしてLintエラー修正✔
* react-hookを入れる✔
  * 他プロジェクトからコピーしてLintエラー修正✔
* swagger.yamlを追加✔
  * mockサーバとして利用できるようにする ⇒ yamlに書いたサンプルをそのまま返してくれるmockがない ⇒ 保留
  * npm scriptとして追加する ⇒ 保留

## Available Scripts

このプロジェクトでは下記スクリプトが実行できます:

### `yarn server`
### `yarn dev:server`

### `yarn dev:react`
### `yarn mock:api`

### `yarn test`

### `yarn build`

### `yarn eject`

### `yarn lint`


## warning "eslint-config-airbnb > eslint-config-airbnb-base@14.0.0" has unmet peer dependency "eslint-plugin-import
```
npx install-peerdeps --dev eslint-config-airbnb --yarn
```

-------
* pemファイル作成方法(idp用)
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