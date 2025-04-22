import express from 'express';
import { sendInquiryMail } from '../controllers/inquiryController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/send', authUser , sendInquiryMail);

export default router;
