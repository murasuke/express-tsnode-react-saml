import express from 'express';
import logger from 'morgan';

const apiPort = 8080;

const app = express();
app.disable('x-powered-by');
app.use(logger('dev'));


// Return status code 200 for all accesses.
app.all('/*', (req, res) => res.json([{ id:'id', data: 'data' }]));
app.listen(apiPort, () => console.log(`Listening on ${apiPort}`));
