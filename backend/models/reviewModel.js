import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  videoUrl: String,
  videoId: String,
  userName: { type: String, required: true },
  images: { type: [String], default: [] },
  submittedAt: { type: Date, default: Date.now },
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;
