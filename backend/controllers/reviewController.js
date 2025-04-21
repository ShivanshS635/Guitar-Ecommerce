import Review from '../models/reviewModel.js';
import Youtube from '../models/youtubeModel.js'
import { v2 as cloudinary } from 'cloudinary';
import Screenshot from '../models/screenshotModel.js';

const extractYouTubeId = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1);
    }

    if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v');
      }

      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.split('/embed/')[1];
      }

      if (parsedUrl.pathname.startsWith('/shorts/')) {
        return parsedUrl.pathname.split('/shorts/')[1];
      }
    }

    return null;
  } catch (err) {
    return null;
  }
};


export const submitReview = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL.' });
    }

    const youtube = new Youtube({ videoUrl, videoId });
    await youtube.save();

    res.json({ success: true, message: 'Review submitted.', youtube });
  } catch (error) {
    console.error('Error in submitReview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTextReview = async (req, res) => {
  try {
    const { description, rating } = req.body;
    const userId = req.user?.userId; // Optional chaining to safely access

    console.log("Review Submission:", description, rating, userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!description || !rating) {
      return res.status(400).json({ success: false, message: 'Description and rating are required.' });
    }

    const review = new Review({ description, rating, user: userId });
    await review.save();

    res.json({ success: true, message: 'Text review submitted.', review });
  } catch (error) {
    console.error('Error in submitTextReview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getTextReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')  // Populate only the `name` field of the user
      .sort({ submittedAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.log('Error in getTextReviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Youtube.find().sort({ submittedAt: -1 });
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