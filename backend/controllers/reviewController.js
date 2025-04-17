import Review from '../models/reviewModel.js';
import User from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import Screenshot from '../models/screenshotModel.js'

const extractYouTubeId = (url) => {
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const submitReview = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL.' });
    }

    const review = new Review({ videoUrl, videoId });
    await review.save();

    res.json({ success: true, message: 'Review submitted.', review });
  } catch (error) {
    console.error('Error in submitReview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ submittedAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const uploadScreenshot = async (req, res) => {
  try {
    const file = req.files?.image;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'review_screenshots',
    });

    const newScreenshot = new Screenshot({
      imageUrl: uploaded.secure_url,
      uploadedAt: Date.now(),
    });

    await newScreenshot.save();

    res.json({ success: true, message: 'Screenshot uploaded', screenshot: newScreenshot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getScreenshots = async (req, res) => {
  try {
    const screenshots = await Screenshot.find().sort({ uploadedAt: -1 });
    res.json({ success: true, screenshots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
