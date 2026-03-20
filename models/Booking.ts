import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    role: { type: String, enum: ['lady', 'gent'], required: true },
    language: { type: String, enum: ['en', 'hr'], default: 'en' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    amountPaid: { type: Number, required: true },
    currency: { type: String, default: 'EUR' },
    couponUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    couponCode: { type: String, default: '' },
    userDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      dob: { type: String, required: true },
      residence: { type: String, required: true },
      education: { type: String, required: true },
      occupation: { type: String, required: true },
      height: { type: String, required: true },
    },
    preferences: {
      children: { type: String, required: true },
      interests: [{ type: String }],
      shortDescription: { type: String, required: true },
      smoker: { type: String, required: true },
      exercise: { type: String, required: true },
      languages: { type: String, required: true },
      lookingFor: { type: String, required: true },
      sleepingHabits: { type: String, required: true },
      outings: { type: String, required: true },
    },
    images: {
      facePhoto: { type: String, required: true },
      bodyPhoto: { type: String, required: true },
    },
    paymentSummary: {
      last4: { type: String, required: true },
      expiry: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
