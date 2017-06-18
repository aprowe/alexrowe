import express from 'express';
import bodyParser from 'body-parser';
import db from './db';

import basicAuth from './middleware/basicAuth';

import router from './routes';
import * as config from './config';

// Initialize app
const app = express();

// Define Middleware and routes
app
  .use(basicAuth)
  .use(router)
  .use(bodyParser.json());

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
