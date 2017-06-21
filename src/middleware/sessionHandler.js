import { insertSession, findSession } from '../models';
import _ from 'lodash';


export function getSession(req, res, next) {
  let session_id = req.cookies.session_id;

  // If a session is present
  if (session_id) {
    return findSession(session_id).then((session) => {
      req.session = session;
      next();
    });
  }

  // Create a new session object
  let session = {
    date_created: new Date(),
  };

  // Create a new session in the database
  return insertSession(session).then(session => {
    res.cookie('session_id', session._id);
    req.session = session;
    next();
  });
}


export function saveSession(req, res, next) {
  if (req.session) {
    insertSession(req.session);
  }

  next();
}
