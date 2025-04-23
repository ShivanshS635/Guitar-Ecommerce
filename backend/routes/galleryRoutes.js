import express from 'express';
import multer from '../middlewares/multer.js';
import {
  addGalleryImages,
  listGalleryImages,
  deleteGalleryImage
} from '../controllers/galleryController.js';

const router = express.Router();

router.post(
  '/add',
  multer.fields([
    { name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' },
    { name: 'image5' }, { name: 'image6' }, { name: 'image7' }, { name: 'image8' },
    { name: 'image9' }, { name: 'image10' },
  ]),
  addGalleryImages
);

router.get('/list', listGalleryImages);
router.post('/remove', deleteGalleryImage);

export default router;
