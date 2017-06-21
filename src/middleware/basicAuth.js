import { findUser } from '../models';
import _ from 'lodash';

function fail (res) {
  res.status(401).end('Unauthorized');
}

function parseAuth (authString) {
  let b64 = authString.split(' ')[1];

  return Buffer.from(b64, 'base64').toString()
    .split(':');
}

export default function authenticate(req, res, next) {

  // Set authentication type
  res.set('WWW-Authenticate', 'Basic');

  let authorization = req.headers.authorization;

  if (!authorization) {
    console.log('No Authorization Header Found');
    return fail(res);
  }

  // Attempt
  let creds;
  try {
    creds = parseAuth(authorization);

  } catch (e) {
    console.log('Failed to parse Authorization');
    return fail(res);
  }

  findUser(creds[0], creds[1]).then(user => {
    if (!user) {
      return fail(res);
    }

    // Attach to request
    req.user = user;
    req.session.user_id = user._id;

    // Continue
    next();
  });
}
