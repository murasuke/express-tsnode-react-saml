import express from 'express';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';

import appProxy from './apiProxy';
import appConfig from '../src/confg';
import samlAuth, {samlPassport} from './auth';

const SERVICE_NAME = 'express-tsnode-react';

const app = express();
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// samlによる認証処理
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(samlPassport.initialize());
app.use(samlPassport.session());
app.use(samlAuth);

// heatbeat
app.get('/up', (req, res) => res.send('up'));

// /${SERVICE_NAME}に対するアクセスは、appProxy経由でバックエンドに転送する
app.use(`/${SERVICE_NAME}`, appProxy);

// reactのコンパイル済みモジュールを返す
app.use(express.static(path.join(__dirname, '../build'), { index: false }));
// トップページ以外の各ページを直接アクセスした場合に開けるようにindex.htmlを返す(react-router用)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const server = http.createServer(app);
server.listen(appConfig.appPort, () => console.log(`Listening on ${appConfig.appPort}`));
server.on('error', () => { console.error(appConfig.appPort); });
