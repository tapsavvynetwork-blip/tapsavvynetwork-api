import User from '../../models/User.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('name email role createdAt');
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user','admin','superadmin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.role = role;
    await user.save();
    res.json({ success: true, data: { id: user._id, role: user.role } });
  } catch (err) { next(err); }
}
