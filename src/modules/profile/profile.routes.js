import express from 'express';
import multer from 'multer';
import { protect } from '../../middlewares/auth.js';
import { createOrUpdateProfile, getMyProfile, getPublicProfile } from './profile.controller.js';
import { storage } from '../../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });
const profileUploads = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'userProfilePhoto', maxCount: 1 },
  { name: 'logoImage', maxCount: 1 },
  { name: 'companyRepresentativePhoto', maxCount: 1 },
  { name: 'offeringImages', maxCount: 10 },
]);

router.get('/me', protect, getMyProfile);
router.post('/me', protect, profileUploads, (req, res, next) => {
  const files = req.files || {};
  if (files.avatar?.length) req.body.avatarUrl = files.avatar[0].path;
  if (files.userProfilePhoto?.length) req.body.userProfilePhotoPath = files.userProfilePhoto[0].path;
  if (files.logoImage?.length) req.body.logoImagePath = files.logoImage[0].path;
  if (files.companyRepresentativePhoto?.length) req.body.companyRepresentativePhotoPath = files.companyRepresentativePhoto[0].path;
  if (files.offeringImages?.length) req.body.offeringImagePaths = files.offeringImages.map((file) => file.path);
  return createOrUpdateProfile(req, res, next);
});

router.get('/:id', getPublicProfile);

export default router;
