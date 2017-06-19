import Monk from 'monk';

import { MONGO_URL } from '../config';

let db = Monk(MONGO_URL);
let users = db.get('users');
let sessions = db.get('sessions');

export default db;

export function findUser(name, password) {
  return db.get('users').findOne({
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
