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
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    console.log('Starting upload for:', req.file.path);

    // Upload with retry and longer timeout
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: 'review_screenshots',
      resource_type: 'auto',
      chunk_size: 6000000,
      timeout: 60000
    });

    console.log('Upload successful:', uploaded.secure_url);

    const newScreenshot = new Screenshot({
      imageUrl: uploaded.secure_url,
      uploadedAt: Date.now(),
    });

    await newScreenshot.save();

    return res.json({ 
      success: true, 
      message: 'Screenshot uploaded', 
      screenshot: newScreenshot 
    });

  } catch (err) {
    console.error('Upload failed:', err);

    const errorMessage = err.http_code === 499 
      ? 'Upload took too long. Try a smaller file or better connection.'
      : 'Failed to upload screenshot';

    return res.status(500).json({ 
      success: false, 
      message: errorMessage 
    });
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

export const deleteYoutubeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Youtube.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return res.status(404).json({ 
        success: false, 
        message: 'YouTube review not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'YouTube review deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting YouTube review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete YouTube review' 
    });
  }
};

export const deleteScreenshot = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedScreenshot = await Screenshot.findByIdAndDelete(id);
    
    if (!deletedScreenshot) {
      return res.status(404).json({ 
        success: false, 
        message: 'Screenshot not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Screenshot deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete screenshot' 
    });
  }
};