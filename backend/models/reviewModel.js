import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
