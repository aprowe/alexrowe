import Monk from 'monk';

import { MONGO_URL } from '../config';

let db = Monk(MONGO_URL);

export default db;

export function findUser(name, password) {
  return db.get('users').findOne({
    name,
    password
  });
}
