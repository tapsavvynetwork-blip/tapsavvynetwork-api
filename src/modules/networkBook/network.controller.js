import Profile from '../profile/profile.model.js';

export async function listDirectory(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const filter = { isBusiness: true };
    if (req.query.q) filter.$text = { $search: req.query.q };
    const skip = (page - 1) * limit;
    const items = await Profile.find(filter).populate('user','name email').skip(skip).limit(limit);
    const total = await Profile.countDocuments(filter);
    res.json({ success: true, data: { items, page, limit, total } });
  } catch (err) { next(err); }
}
