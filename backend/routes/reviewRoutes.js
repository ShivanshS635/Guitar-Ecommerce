import express from 'express';
import { submitReview, getAllReviews } from '../controllers/reviewController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/submit', authUser, submitReview);
router.get('/all', getAllReviews);

export default router;