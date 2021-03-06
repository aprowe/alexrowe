/**
 * Config Variables
 */

import _ from 'lodash';

// Development / default Config
let config = {
  PORT: 3000,
  MONGO_URL: 'mongodb://localhost/api',
  LYRICS_DB_URL: 'mongodb://localhost/lyrics',
};

// Production Config
let prodConfig = {
  PORT: 80
};

if (process.env.NODE_ENV == 'production') {
  config = _.merge(config, prodConfig);
}

export default config;
