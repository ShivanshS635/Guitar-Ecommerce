import mongoose from 'mongoose';

const screenshotSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Screenshot', screenshotSchema);