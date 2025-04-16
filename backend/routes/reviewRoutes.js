import express from 'express';
import { submitReview, getAllReviews, uploadScreenshot , getScreenshots } from '../controllers/reviewController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/submit', authUser, submitReview);
router.get('/all', getAllReviews);
router.post('/upload-image', authUser, uploadScreenshot);
router.get('/screenshots' , getScreenshots)


export default router;