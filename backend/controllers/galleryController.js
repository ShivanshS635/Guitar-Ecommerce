import Gallery from '../models/galleryModel.js';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Upload gallery images
const addGalleryImages = async (req, res) => {
  try {
    const { category } = req.body;
    const files = Object.values(req.files).flat();

    // Resize and upload images
    const uploadPromises = files.map(async (file) => {
      // Resize the image using sharp (resize to max width of 800px)
      const resizedImageBuffer = await sharp(file.path)
        .resize(800) // Resize to a max width of 800px, adjust as needed
        .toBuffer();

      // Upload the resized image buffer to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'gallery', // You can set a custom folder in Cloudinary
          },
          (error, result) => {
            if (error) {
              reject(new Error('Failed to upload image to Cloudinary'));
            } else {
              resolve({
                image: result.secure_url,
                category,
              });
            }
          }
        );

        // Pipe the resized image buffer to Cloudinary upload stream
        uploadStream.end(resizedImageBuffer);
      });

      return result; // Return the uploaded image URL and category
    });

    // Wait for all uploads to complete and insert the data into the database
    const savedImages = await Gallery.insertMany(await Promise.all(uploadPromises));

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      galleryItems: savedImages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all images
const listGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find({});
    res.json({ success: true, galleryItems: images });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete one image by ID
const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.body;
    await Gallery.findByIdAndDelete(id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addGalleryImages, listGalleryImages, deleteGalleryImage };
