import mongoose from 'mongoose';

const youtubeSchema = mongoose.Schema({
  videoUrl: String,
  videoId: String,
  submittedAt: { type: Date, default: Date.now },
});

const YouTube = mongoose.model('Youtube', youtubeSchema);
export default YouTube;