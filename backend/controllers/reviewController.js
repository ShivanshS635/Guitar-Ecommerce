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
    console.log('Received videoUrl:', videoUrl);  // Log videoUrl

    const { userId } = req.user;
    console.log('User ID:', userId);  // Log userId

    const videoId = extractYouTubeId(videoUrl);
    console.log('Extracted videoId:', videoId);  // Log extracted videoId

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL.' });
    }

    // Fetch the user to get the name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    const userName = user.name;  // Use the `name` field from the user

    const review = new Review({ userId, videoUrl, videoId, userName });
    await review.save();

    res.json({ success: true, message: 'Review submitted.', review });
  } catch (error) {
    console.error('Error in submitReview:', error);  // Log error to the console
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    // Fetch all reviews and populate the userId to get the user name
    const reviews = await Review.find()
      .sort({ submittedAt: -1 })
      .populate('userId', 'name')  // Populate only the `name` field of the user
      .exec();

    // Create a response with userName
    const reviewsWithUserNames = reviews.map((review) => ({
      ...review._doc,
      userName: review.userId.name,  // Use the name field from populated userId
    }));

    res.json({ success: true, reviews: reviewsWithUserNames });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadScreenshot = async (req, res) => {
  try {
    const { userId } = req.user;
    const file = req.files?.image;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'review_screenshots',
    });

    const newScreenshot = new Screenshot({
      userId,
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
