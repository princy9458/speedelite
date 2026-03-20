import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    priceMale: { type: Number, required: true, min: 0 },
    priceFemale: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    bookingDeadline: { type: Date, required: true },
    description: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    language: { type: String, default: 'en' },
    translations: {
      en: {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        location: { type: String, default: '' },
      },
      hr: {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        location: { type: String, default: '' },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
