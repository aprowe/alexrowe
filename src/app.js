import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import basicAuth from './middleware/basicAuth';
import { getSession, saveSession } from './middleware/sessionHandler';
import mustacheMiddleware from './middleware/mustache';

import apiRouter from './routes/api';
import baseRouter from './routes';
import config from './config';

// Initialize app
const app = express();

// Define Middleware and routes
app
  .use(cookieParser())
  .use(getSession)
  .use(mustacheMiddleware)
  // .use(express.static(__dirname + '/../static', {
  //   extensions: ['html']
  // }))

  // Make client assets available
  .use('/assets', express.static('public'));

// Only use harp for development
if (process.env.NODE_ENV !== 'production') {
  // app.use(require('harp').mount(__dirname + '/../static'));
}

app
  .use('/', baseRouter)
  .use('/admin', basicAuth)
  .use('/api', apiRouter)
  .use(bodyParser.json())
  .use(saveSession)
  ;


app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
