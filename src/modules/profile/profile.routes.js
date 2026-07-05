import express from 'express';
import multer from 'multer';
import { protect } from '../../middlewares/auth.js';
import { createOrUpdateProfile, getMyProfile, getPublicProfile } from './profile.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/me', protect, getMyProfile);
router.post('/me', protect, upload.single('avatar'), (req, res, next) => {
  // attach avatarUrl if uploaded
  if (req.file) req.body.avatarUrl = `/uploads/${req.file.filename}`;
  return createOrUpdateProfile(req, res, next);
});

router.get('/:id', getPublicProfile);

export default router;
