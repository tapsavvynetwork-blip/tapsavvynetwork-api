import Profile from './profile.model.js';
import User from '../../models/User.js';

export async function createOrUpdateProfile(req, res, next) {
  try {
    const userId = req.user._id;
    const data = req.body;
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      Object.assign(profile, data);
      await profile.save();
    } else {
      profile = await Profile.create({ user: userId, ...data });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function getMyProfile(req, res, next) {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'email name role');
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id).populate('user', 'email name');
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}
