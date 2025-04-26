import express from 'express';
import upload from '../middlewares/multer.js';
import {
  submitReview,
  getAllReviews,
  uploadScreenshot,
  getScreenshots,
  submitTextReview,
  getTextReviews,
  deleteYoutubeReview,
  deleteScreenshot
} from '../controllers/reviewController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/submit', authUser, submitReview);
router.post('/text', authUser, submitTextReview);
router.get('/all', getAllReviews);
router.post('/upload-image', upload.single('image'), uploadScreenshot);
router.get('/screenshots', getScreenshots);
router.get('/textReviews' , getTextReviews);
router.delete('/youtube/:id', authUser, deleteYoutubeReview);
router.delete('/screenshots/:id', authUser, deleteScreenshot);

export default router;
