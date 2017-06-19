import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import db from './db';

import basicAuth from './middleware/basicAuth';
import { getSession, saveSession } from './middleware/sessionHandler';

import router from './routes';
import config from './config';

// Initialize app
const app = express();

// Define Middleware and routes
app
  .use(cookieParser())
  .use(getSession)
  .use(express.static(__dirname + '/../static', {
    extensions: ['html']
  }));

// Only use harp for development
if (process.env.NODE_ENV !== 'production') {
  app.use(require('harp').mount(__dirname + '/../static'));
}

app
  .use('/admin', basicAuth)
  .use(bodyParser.json())
  .use(router)
  .use(saveSession)
  ;


app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
