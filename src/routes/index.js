import express from 'express';

import template from '../views/index.md';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.mustache(template, {foo: 'bar'});
  next();
});

export default router;
