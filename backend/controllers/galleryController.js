import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import Gallery from '../models/galleryModel.js';

const addGalleryImages = async (req, res) => {
  try {
    const { category } = req.body;
    
    // Validate input
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No images provided' 
      });
    }

    if (!category || !['body', 'neck', 'inlay', 'product'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Valid category is required (body, neck, inlay, or product)'
      });
    }

    // Process images
    const uploadPromises = req.files.map(async (file) => {
      try {
        // Resize image
        const resizedImage = await sharp(file.path)
          .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: `gallery/${category}` },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          ).end(resizedImage);
        });

        // Return in exact format your schema expects
        return {
          image: result.secure_url, // Must match your schema's 'image' field
          category: category       // Must match your schema's 'category' field
        };
      } catch (error) {
        console.error(`Error processing ${file.originalname}:`, error);
        return null;
      }
    });

    // Wait for all uploads
    const uploadResults = await Promise.all(uploadPromises);
    const successfulUploads = uploadResults.filter(result => result !== null);

    if (successfulUploads.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'All image uploads failed'
      });
    }

    // Save to database
    const savedImages = await Gallery.insertMany(successfulUploads);

    // Clean up temp files
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error(`Error deleting ${file.path}:`, err);
      }
    });

    res.status(201).json({
      success: true,
      message: `${savedImages.length} images uploaded`,
      images: savedImages
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error(`Error cleaning up ${file.path}:`, err);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed'
    });
  }
};

const listGalleryImages = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    const galleryImages = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: galleryImages.length,
      galleryImages
    });
  } catch (error) {
    console.error('Error listing gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve gallery images'
    });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the image first to get Cloudinary public_id
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete from database
    await Gallery.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
};

export { addGalleryImages, listGalleryImages, deleteGalleryImage };