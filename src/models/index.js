import Monk from 'monk';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

import config from '../config';

mongoose.Promise = bluebird;

let db = Monk(config.MONGO_URL);
let users = db.get('users');
let sessions = db.get('sessions');

export default db;

export function findUser(name, password) {
  return users.findOne({
    name,
    password
  });
}

export function findSession (session_id) {
  return sessions.findOne(session_id);
}

export function insertSession (session) {
  if (!session._id) {
    return sessions.insert(session);
  } else {
    return sessions.update(session._id, session);
  }
}
