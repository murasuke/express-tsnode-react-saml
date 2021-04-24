/**
 * saml認証用モジュール
 * ・passportにSAML用のStrategyをセット
 * ・全てのアクセスを認証チェックする['/', '/*']
 *   ⇒ 未認証の場合は/login へリダイレクト
 *   ⇒ 認証済みの場合は、アクセスしたURLを返す
 */
import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-saml';
import fs from 'fs';
import path from 'path';

export const samlPassport = passport;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// samll認証用の設定
const samlStrategy = new Strategy(
  {
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: process.env.CALLBACK_URL,
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: process.env.ENTRY_POINT,
    // Usually specified as `/shibboleth` from site root
    issuer: process.env.ISSUER,
    identifierFormat: null,

    // Identity Providerのサーバ証明書
    cert: fs.readFileSync('idp-public-cert.pem', 'utf8'),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
  },
  (profile, done) => done(null, profile)
);

console.log(JSON.stringify(samlStrategy, null, '  '));
passport.use(samlStrategy);


const router = express.Router();
const authModule = passport.authenticate('saml', { failureRedirect: '/login/fail' });

/**
 * ログイン処理
 */
router.get('/login', authModule, (req, res) => {
  res.redirect('/');
});


/**
 * idpで認証後のコールバックURL
 * ⇒ユーザ情報が「req.user」にセットされている
 */
router.post('/login/callback', authModule, (req, res) => {
  console.log('/login/callback', req.user);
  res.redirect('/');
});

/**
 * ログイン失敗時の処理
 */
router.get('/login/fail', (req, res) => {
  res.status(401).send('Login failed');
});

/**
 * SPメタデータを返す
 */
router.get('/Metadata', (req, res) => {
  res.type('application/xml');
  const spCert = fs.readFileSync(path.join(__dirname, 'sp-public-cert.pem'), 'utf8');
  res.status(200).send(samlStrategy.generateServiceProviderMetadata(spCert));
});

/**
 * ログアウト
 * ・'/'にアクセスしても、認証情報がないため再度認証画面へ飛ばされる。
 */
router.get('/logout', (req, res) => {
  req.logout();
  // TODO: invalidate session on IP
  res.redirect('/');
});

// React側で、ユーザ情報を取得するため
//  ⇒ samlで認証後、sessionにユーザ情報を保持しindex.htmlを返す。
//     そのタイミングでReactは表示されるが、ユーザ情報はReact側に渡っていない
//     ⇒ Reactで初回画面ロード時、下記APIを呼び出してユーザ情報を取得する
/**
 * React側で、ユーザ情報を取得するためのapi
 *  ・saml認証後、sessionにユーザ情報を保持してからindex.htmlを返す。
 *    そのタイミングでReactは表示されるが、ユーザ情報はReact側に渡っていない。
 *     (固定htmlを返すだけなので、動的な情報を返せない)
 *    ⇒ Reactで初回画面ロード時、下記APIを呼び出してユーザ情報を取得する
 */
router.get('/userInfo', (req, res) => {
  res.json(req.user);
});

/**
 * 認証チェック
 * ・全てのReact側からの通信に対して、認証チェックを行う
 *   ⇒認証されていない場合は、saml認証を行う
 */
router.all(['/', '/*'], (req: any, res, next) => {
  if (req.isAuthenticated()) {
    console.log(`Authenticated:${JSON.stringify(req.user)}`);
    return next();
  }

  if (req.url === '/up') {
    return next();
  }

  console.log(`${req.url} Not authenticated. Redirect to /login`);
  return authModule(req, res, next);
});

export default router;