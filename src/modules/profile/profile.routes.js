import express from 'express';
import multer from 'multer';
import { protect } from '../../middlewares/auth.js';
import { createOrUpdateProfile, getMyProfile, getPublicProfile } from './profile.controller.js';
import { storage } from '../../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.get('/me', protect, getMyProfile);
router.post('/me', protect, upload.single('avatar'), (req, res, next) => {
  if (req.file) req.body.avatarUrl = req.file.path;
  return createOrUpdateProfile(req, res, next);
});

router.get('/:id', getPublicProfile);

export default router;
