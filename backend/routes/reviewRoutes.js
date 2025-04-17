import express from 'express';
import {
  submitReview,
  getAllReviews,
  uploadScreenshot,
  getScreenshots,
  submitTextReview,
  getTextReviews,
} from '../controllers/reviewController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/submit', authUser, submitReview);
router.post('/text', authUser, submitTextReview);
router.get('/all', getAllReviews);
router.post('/upload-image', authUser, uploadScreenshot);
router.get('/screenshots', getScreenshots);
router.get('/textReviews' , getTextReviews);

export default router;
