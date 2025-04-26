import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  FiUpload, 
  FiCheckCircle, 
  FiX, 
  FiLoader, 
  FiTrash2,
  FiImage,
  FiRefreshCw
} from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { backendUrl } from '../App';

const categories = [
  { value: 'body', label: 'Body' },
  { value: 'neck', label: 'Neck' },
  { value: 'inlay', label: 'Inlay' },
  { value: 'product', label: 'Product' }
];

const UploadGallery = ({ token }) => {
  // State for file uploads
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('body');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // State for gallery management
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch gallery images when category changes
  useEffect(() => {
    fetchGalleryImages();
  }, [category]);

  const fetchGalleryImages = async () => {
    try {
      setIsLoadingGallery(true);
      const response = await axios.get(`${backendUrl}/api/gallery/list`, {
        params: { category },
        headers: { Authorization: `Bearer ${token}` }
      });
      setGalleryImages(response.data.galleryImages);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setMessage({
        text: 'Failed to load gallery images',
        type: 'error'
      });
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setMessage({
        text: `Some files were rejected. Only images (JPEG, PNG, WEBP) under 10MB are allowed.`,
        type: 'error'
      });
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/webp',
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (id) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files => files.filter(file => file.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file.file);
    });
    formData.append('category', category);

    try {
      const response = await axios.post(`${backendUrl}/api/gallery/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      setMessage({
        text: `Successfully uploaded ${response.data.images.length} images!`,
        type: 'success'
      });
      setFiles([]);
      fetchGalleryImages(); // Refresh gallery after upload
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to upload images',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
    setMessage({ text: '', type: '' });
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`${backendUrl}/api/gallery/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({
        text: 'Image deleted successfully',
        type: 'success'
      });
      fetchGalleryImages(); // Refresh gallery after deletion
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({
        text: 'Failed to delete image',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gallery Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Upload New Images</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    category === cat.value
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <FiUpload className="w-8 h-8 text-gray-400" />
              <p className="font-medium text-gray-700">
                {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">Supports JPEG, PNG, WEBP (max 10MB each)</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">
                  Selected Files ({files.length})
                </h3>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {files.map(file => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                    <div className="mt-1 text-xs text-gray-600 truncate">
                      {file.file.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {(file.file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={clearAll}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={uploadFiles}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isUploading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Uploading... {progress}%
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Upload {files.length} {files.length === 1 ? 'Image' : 'Images'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Gallery Images ({galleryImages.length})
            </h3>
            <button
              onClick={fetchGalleryImages}
              disabled={isLoadingGallery}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiRefreshCw className={`mr-1 ${isLoadingGallery ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {isLoadingGallery ? (
            <div className="flex justify-center items-center h-40">
              <FiLoader className="animate-spin text-gray-400 text-2xl" />
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FiImage className="mx-auto w-8 h-8 text-gray-400" />
              <p className="mt-2 text-gray-500">No images found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2">
              {galleryImages.map(image => (
                <div key={image._id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={image.image}
                      alt={`Gallery ${image.category}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => deleteImage(image._id)}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-70"
                  >
                    {isDeleting ? (
                      <FiLoader className="animate-spin w-3 h-3" />
                    ) : (
                      <FiTrash2 className="w-3 h-3" />
                    )}
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-1 text-xs text-center">
                    {image.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {message.text && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700' 
              : 'bg-green-50 text-green-700'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'error' ? (
              <FiX className="mr-2" />
            ) : (
              <FiCheckCircle className="mr-2" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadGallery;