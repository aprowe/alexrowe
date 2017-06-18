import express from 'express';
import basicAuth from './middleware/basicAuth';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({hi: req.user.name});
});


export default router;
