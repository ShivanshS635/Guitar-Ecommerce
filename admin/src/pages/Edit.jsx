import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = ({ token }) => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Body',
    price: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/product/single`,
          { id: productId },
          { headers: { token } }
        );
        
        if (response.data.success) {
          const product = response.data.product;
          setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price
          });
          setExistingImages(product.img || []);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product data.");
      }
    };

    fetchProductData();
  }, [productId, token]);

  const handleImageChange = (index, e) => {
    const files = [...imageFiles];
    files[index] = e.target.files[0];
    setImageFiles(files);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', productId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);

      // Append only files that were actually selected
      imageFiles.forEach((file, index) => {
        if (file) {
          formDataToSend.append(`images`, file); // Changed to use same field name
        }
      });

      const response = await axios.post(
        `${backendUrl}/api/product/edit`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (response.data.success) {
        toast.success('Product updated successfully');
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col w-full items-start gap-6 p-4 max-w-4xl mx-auto">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="w-full">
          <p className="mb-3 font-medium text-lg">Current Images</p>
          <div className="flex gap-3 flex-wrap">
            {existingImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`product-${index}`}
                  className="w-24 h-24 object-cover rounded border border-gray-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload Section */}
      <div className="w-full">
        <p className="mb-3 font-medium text-lg">Update Images</p>
        <div className="flex gap-3 flex-wrap">
          {[0, 1, 2, 3].map((index) => (
            <label key={index} className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-400 w-24 h-24 rounded flex items-center justify-center hover:border-yellow-500 transition-colors">
                {imageFiles[index] ? (
                  <img
                    src={URL.createObjectURL(imageFiles[index])}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={assets.upload_area}
                    alt="upload"
                    className="w-10 h-10 opacity-70"
                  />
                )}
              </div>
              <input
                type="file"
                onChange={(e) => handleImageChange(index, e)}
                accept="image/*"
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details Form */}
      <div className="w-full space-y-6">
        <div>
          <label className="block mb-2 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Product Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product description"
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="Body">Body</option>
              <option value="Inlay">Inlay</option>
              <option value="Neck">Neck</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default Edit;