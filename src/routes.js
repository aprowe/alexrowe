import express from 'express';

import QMote from './lib/qmote';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json(req.session);
  next();
});

// QMote Actions
router.get('/qmote/:action', (req, res, next) => {
  let action = QMote[req.params.action];

  console.log(JSON.stringify(req.headers));
  if (!action) {
    res.status(400).send(`Action ${req.params.action} not found`);
    return;
  }

  action(req.query).then( (status)=>{
    res.json({status});
    next();
  });
});

export default router;
