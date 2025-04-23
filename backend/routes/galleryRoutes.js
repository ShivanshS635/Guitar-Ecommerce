import express from 'express';
import multer from '../middlewares/multer.js';
import {
  addGalleryImages,
  listGalleryImages,
  deleteGalleryImage
} from '../controllers/galleryController.js';

const router = express.Router();

// Updated to handle multiple files with dynamic field names
router.post('/add', multer.array('images'), addGalleryImages);
router.get('/list', listGalleryImages);
router.delete('/:id', deleteGalleryImage);

export default router;