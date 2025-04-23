import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const categories = ['body', 'neck', 'inlay', 'product'];

const GalleryUpload = ({ token }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [category, setCategory] = useState('body');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith('image/'));
    setImageFiles(validImages);
    setImagePreviews(validImages.map((file) => URL.createObjectURL(file)));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFiles || imageFiles.length === 0) {
      setMessage('Please select images to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    imageFiles.forEach((file, i) => {
      formData.append(`image${i + 1}`, file);
    });
    formData.append('category', category);

    try {
      const response = await axios.post(
        `${backendUrl}/api/gallery/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.success) {
        toast.success('Images uploaded successfully!');
        setImageFiles([]);
        setImagePreviews([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error uploading images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen pt-12 px-4 sm:px-10 lg:px-16">
      <h2 className="text-3xl sm:text-4xl text-center mb-10 font-bold text-yellow-600 drop-shadow-md">
        Upload Gallery Images
      </h2>

      <div className="bg-gray-100 p-8 rounded-xl shadow-md max-w-3xl mx-auto space-y-12 border border-gray-200">
        {/* Category Select */}
        <div>
          <label className="block text-lg font-semibold mb-1">Select Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-white text-gray-800 py-3 px-4 rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-lg font-semibold mb-1">Choose Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="bg-white text-gray-800 py-2 px-4 rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            accept="image/*"
          />
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                className="w-full h-24 object-cover rounded-lg shadow-lg border"
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-md font-semibold transition"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {/* Status Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryUpload;
