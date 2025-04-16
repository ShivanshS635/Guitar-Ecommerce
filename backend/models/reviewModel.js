import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  videoUrl: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true, // Ensure that the username is stored
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
