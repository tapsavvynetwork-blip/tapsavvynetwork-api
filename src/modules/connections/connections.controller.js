import Connection from './connection.model.js';
import User from '../../models/User.js';

export async function sendRequest(req, res, next) {
  try {
    const from = req.user._id;
    const { recipientId, message } = req.body;
    if (!recipientId) return res.status(400).json({ success: false, message: 'recipientId required' });
    if (recipientId === String(from)) return res.status(400).json({ success: false, message: 'Cannot connect to yourself' });
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ success: false, message: 'Recipient not found' });
    // create or update
    let conn = await Connection.findOne({ requester: from, recipient: recipientId });
    if (conn) return res.status(409).json({ success: false, message: 'Request already sent' });
    conn = await Connection.create({ requester: from, recipient: recipientId, message });
    res.status(201).json({ success: true, data: conn });
  } catch (err) {
    next(err);
  }
}

export async function listIncoming(req, res, next) {
  try {
    const userId = req.user._id;
    const items = await Connection.find({ recipient: userId, status: 'pending' }).populate('requester', 'name email');
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

export async function respond(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { action } = req.body; // 'accept'|'reject'|'block'
    if (!['accept','reject','block'].includes(action)) return res.status(400).json({ success: false, message: 'Invalid action' });
    const conn = await Connection.findById(id);
    if (!conn) return res.status(404).json({ success: false, message: 'Request not found' });
    if (String(conn.recipient) !== String(userId)) return res.status(403).json({ success: false, message: 'Not allowed' });
    conn.status = action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'blocked';
    conn.respondedAt = new Date();
    await conn.save();
    res.json({ success: true, data: conn });
  } catch (err) { next(err); }
}

export async function listConnections(req, res, next) {
  try {
    const userId = req.user._id;
    const items = await Connection.find({ $or: [{ requester: userId }, { recipient: userId }], status: 'accepted' }).populate('requester recipient', 'name email');
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

export async function removeConnection(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const conn = await Connection.findById(id);
    if (!conn) return res.status(404).json({ success: false, message: 'Not found' });
    if (String(conn.requester) !== String(userId) && String(conn.recipient) !== String(userId)) return res.status(403).json({ success: false, message: 'Not allowed' });
    await conn.deleteOne();
    res.json({ success: true, message: 'Connection removed' });
  } catch (err) { next(err); }
}
