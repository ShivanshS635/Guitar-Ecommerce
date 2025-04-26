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



    res.status(201).json({
      success: true,
      message: `${savedImages.length} images uploaded`,
      images: savedImages
    });

  } catch (error) {
    console.error('Upload error:', error);
    

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
    
    // Delete from database only
    const deletedImage = await Gallery.findByIdAndDelete(id);
    
    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in gallery'
      });
    }

    res.json({
      success: true,
      message: 'Image removed from gallery successfully'
    });
  } catch (error) {
    console.error('Error removing image from gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove image from gallery'
    });
  }
};

export { addGalleryImages, listGalleryImages, deleteGalleryImage };