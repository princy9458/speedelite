import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  gender: { type: String, enum: ['lady', 'gent'] },
  dob: { type: String, default: '' },
  residence: { type: String, default: '' },
  education: { type: String, default: '' },
  occupation: { type: String, default: '' },
  height: { type: String, default: '' },
  children: { type: String, default: '' },
  smoker: { type: String, default: '' },
  exercise: { type: String, default: '' },
  languages: { type: String, default: '' },
  lookingFor: { type: String, default: '' },
  sleepingHabits: { type: String, default: '' },
  outings: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  interests: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
