import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json(req.session);
  next();
});

export default router;
