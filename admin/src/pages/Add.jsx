import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Body',
    price: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const data = new FormData();
  
      // Append text fields
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
  
      // Append images with field names: image1, image2, image3, image4
      images.forEach((image, index) => {
        data.append(`image${index + 1}`, image);
      });
  
      const response = await axios.post(`${backendUrl}/api/product/add`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        toast.success('Product added successfully!');
        setImages([]);
        setFormData({
          name: '',
          description: '',
          category: 'Body',
          price: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      
      <form onSubmit={submitHandler}>
        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Product Images (Max 4)</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                <FiUpload size={20} />
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category and Price */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Body">Body</option>
              <option value="Inlay">Inlay</option>
              <option value="Neck">Neck</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default Add;