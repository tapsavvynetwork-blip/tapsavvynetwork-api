import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: { type: String },
  company: { type: String },
  email: { type: String },
  phone: { type: String },
  rawText: { type: String },
  source: { type: String },
  status: { type: String, enum: ['new','contacted','qualified','lost'], default: 'new' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Lead', LeadSchema);
