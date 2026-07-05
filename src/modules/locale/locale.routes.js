import express from 'express';
import localeMw from '../../middlewares/locale.js';

const router = express.Router();

router.use(localeMw);

router.get('/', (req, res) => {
  res.json({ success: true, locale: req.locale, supported: ['en','hi','mr'] });
});

export default router;
