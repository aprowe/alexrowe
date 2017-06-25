import express from 'express';
import _ from 'lodash';

import songController from '../controllers/lyrics/songs';
import artistController from '../controllers/lyrics/artists';

const router = express.Router();

let createRoute = fn => {
  return (req, res, next) => {
    let query = req.query;

    // Type cast numbers
    for (let i in query) {
      // if (RegExp.match(/[0-9]*(.|)[0-9]+/,query[i])) {
        // query[i] = Number(query[i]);
      // }
    }

    fn(query, req).then(json => {
      res.json(json)
    }).catch(err => {
      res.status(400).json(err);
    });
  }
}

let songRoutes   = _.mapValues(songController,   fn => createRoute(fn));
let artistRoutes = _.mapValues(artistController, fn => createRoute(fn));

router.get('/song', songRoutes.list);
router.get('/song/search', songRoutes.search);
router.get('/song/:song_id', songRoutes.find);

router.get('/artist', artistRoutes.list);
router.get('/artist/search', artistRoutes.search);
router.get('/artist/:artist_id', artistRoutes.find);

export default router;
