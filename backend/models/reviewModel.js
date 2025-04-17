import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  videoUrl: String,
  videoId: String,
  images: { type: [String], default: [] },
  submittedAt: { type: Date, default: Date.now },
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;
