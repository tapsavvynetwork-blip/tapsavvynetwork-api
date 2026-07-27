import bcrypt from 'bcryptjs';
import Profile from './profile.model.js';
import User from '../../models/User.js';

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  return ['true', '1', 'yes', 'on'].includes(normalized);
}

function parseJson(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeUserType(value) {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (['ind', 'individual'].includes(normalized)) return 'ind';
  if (['org', 'business', 'organisation', 'organization'].includes(normalized)) return 'org';
  return value;
}

const profileFields = [
  'userType',
  'fullName',
  'gender',
  'jobTitle',
  'companyName',
  'company',
  'jobCategory',
  'phoneNumber',
  'whatsappNumber',
  'companyAddress',
  'companyAddressType',
  'dob',
  'bio',
  'location',
  'website',
  'industry',
  'companySize',
  'username',
  'cardThemeColor',
  'buttonThemeColor',
  'links',
  'avatarUrl',
  'userProfilePhotoPath',
  'logoImagePath',
  'companyRepresentativePhotoPath',
  'selectedPlanName',
  'isYearly',
  'offeringType',
  'offeringDescription',
  'offeringImagePaths',
  'offeringCaptions',
  'websiteLink',
  'instagramLink',
  'linkedinLink',
  'twitterLink',
  'keepMeSignedIn',
  'isBusiness',
];

export async function createOrUpdateProfile(req, res, next) {
  try {
    const userId = req.user._id;
    const profileData = {};

    profileFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profileData[field] = req.body[field];
      }
    });

    if (profileData.userType) {
      profileData.userType = normalizeUserType(profileData.userType);
      if (profileData.userType === 'org') profileData.isBusiness = true;
      if (profileData.userType === 'ind') profileData.isBusiness = false;
    }

    if (profileData.isYearly !== undefined) {
      profileData.isYearly = parseBoolean(profileData.isYearly);
    }
    if (profileData.keepMeSignedIn !== undefined) {
      profileData.keepMeSignedIn = parseBoolean(profileData.keepMeSignedIn);
    }
    if (profileData.isBusiness !== undefined) {
      profileData.isBusiness = parseBoolean(profileData.isBusiness);
    }

    profileData.links = parseJson(profileData.links);
    profileData.offeringImagePaths = parseJson(profileData.offeringImagePaths);
    profileData.offeringCaptions = parseJson(profileData.offeringCaptions);

    const userUpdates = {};
    if (req.body.email) userUpdates.email = req.body.email;
    if (req.body.password) userUpdates.passwordHash = await bcrypt.hash(req.body.password, 10);
    if (req.body.fullName) userUpdates.name = req.body.fullName;
    if (req.body.name) userUpdates.name = req.body.name;

    if (Object.keys(userUpdates).length) {
      const user = await User.findById(userId).select('+passwordHash');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (userUpdates.email && userUpdates.email !== user.email) {
        const existing = await User.findOne({ email: userUpdates.email, _id: { $ne: userId } });
        if (existing) return res.status(409).json({ success: false, message: 'Email already in use' });
      }
      Object.assign(user, userUpdates);
      await user.save();
    }

    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = await Profile.create({ user: userId, ...profileData });
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
