import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import harp from 'harp';
import db from './db';

import basicAuth from './middleware/basicAuth';
import { getSession, saveSession } from './middleware/sessionHandler';

import router from './routes';
import * as config from './config';

// Initialize app
const app = express();

// Define Middleware and routes
app
  .use(cookieParser())
  .use(getSession)
  .use(express.static(__dirname + '/../public'))
  .use('/admin', basicAuth)
  .use(bodyParser.json())
  .use(router)
  .use(saveSession)
  ;

// Only use harp for development
if (process.env.NODE_ENV !== 'production') {
  app.use(harp.mount(__dirname + '/../public'));
}

console.log(process.env.NODE_ENV);

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
