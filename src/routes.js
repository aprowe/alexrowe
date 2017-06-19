import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json(req.session);
  next();
});

router.get('/test', (req, res, next) => {
  res.json({works: true});
  next();
});


export default router;
