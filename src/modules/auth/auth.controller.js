import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';
import RefreshToken from '../../models/RefreshToken.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash: hash });
    res.status(201).json({ success: true, message: 'User created', data: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, config.JWT_ACCESS_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId: user._id }, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN });
    // store refresh token
    const expiresAt = new Date(Date.now() + parseDuration(config.JWT_REFRESH_EXPIRES_IN));
    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });
    res.json({ success: true, message: 'Login successful', data: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
}

function parseDuration(str) {
  // supports '15m', '7d', '1h'
  const num = parseInt(str, 10);
  if (str.endsWith('m')) return num * 60 * 1000;
  if (str.endsWith('h')) return num * 60 * 60 * 1000;
  if (str.endsWith('d')) return num * 24 * 60 * 60 * 1000;
  return num;
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Missing refreshToken' });
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    // verify
    let payload;
    try {
      payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, config.JWT_ACCESS_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRES_IN });
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Missing refreshToken' });
    await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}
