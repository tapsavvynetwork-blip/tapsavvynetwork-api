import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  displayName: { type: String },
  bio: { type: String },
  company: { type: String },
  avatarUrl: { type: String },
  isBusiness: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema);
