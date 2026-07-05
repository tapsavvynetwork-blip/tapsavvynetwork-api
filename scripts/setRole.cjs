const mongoose = require('mongoose');
const User = require('../src/models/User.js').default;

const [,, email, role] = process.argv;
if (!email || !role) {
  console.error('Usage: node scripts/setRole.cjs <email> <role>');
  process.exit(1);
}

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tsn';

async function run() {
  await mongoose.connect(uri);
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found');
    process.exit(2);
  }
  user.role = role;
  await user.save();
  console.log('Updated', user.email, '->', user.role);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(3); });
