import express from 'express';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import session from 'express-session';
import passport from 'passport';
import saml, {Strategy} from 'passport-saml';

import appProxy from './apiProxy';
import appConfig from '../src/confg';

const SERVICE_NAME = 'express-tsnode-react';


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const samlStrategy = new Strategy(
  {
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: process.env.CALLBACK_URL,
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: process.env.ENTRY_POINT,
    // Usually specified as `/shibboleth` from site root
    issuer: process.env.ISSUER,
    identifierFormat: null,
    // Service Provider private key
    // decryptionPvk: fs.readFileSync(path.join(__dirname, 'sp-private-key.pem'), 'utf8'),
    // // Service Provider Certificate
    // // privateCert: fs.readFileSync(path.join(__dirname, 'sp-public-cert.pem'), 'utf8'),
    // privateKey: fs.readFileSync(path.join(__dirname, 'sp-public-cert.pem'), 'utf8'),
    // Identity Provider's public key
    cert: fs.readFileSync('idp-public-cert.pem', 'utf8'),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
  },
  (profile, done) => done(null, profile)
);

console.log(JSON.stringify(samlStrategy, null, '  '));
passport.use(samlStrategy);

const app = express();
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------------------------------------------------
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

app.get('/',
  ensureAuthenticated,
  (req, res) => {
    res.send('Authenticated');
  }
);

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.post('/login/callback',
   passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/login/fail',
  (req, res) => {
    res.status(401).send('Login failed');
  }
);

app.get('/Shibboleth.sso/Metadata',
  (req, res) => {
    res.type('application/xml');
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(fs.readFileSync(path.join(__dirname, 'sp-public-cert.pem'), 'utf8')));
  }
);
// ----------------------------------------------------------------------

app.use(express.static(path.join(__dirname, '../build')));
app.get('/up', (req, res) => res.send('up'));
app.use(`/${SERVICE_NAME}`, appProxy);

const server = http.createServer(app);
server.listen(appConfig.appPort, () => console.log(`Listening on ${appConfig.appPort}`));
server.on('error', () => { console.error(appConfig.appPort); });
