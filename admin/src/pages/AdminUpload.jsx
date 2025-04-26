import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const AdminUpload = ({ token }) => {
  // State for YouTube upload
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubePreview, setYoutubePreview] = useState('');
  
  // State for screenshot upload
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // State for management
  const [youtubeReviews, setYoutubeReviews] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  // Fetch data on component mount
  useEffect(() => {
    if (activeTab === 'youtube') {
      fetchYoutubeReviews();
    } else if (activeTab === 'screenshots') {
      fetchScreenshots();
    }
  }, [activeTab]);

  const fetchYoutubeReviews = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${backendUrl}/api/reviews/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setYoutubeReviews(res.data.reviews);
    } catch (error) {
      toast.error('Failed to fetch YouTube reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScreenshots = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${backendUrl}/api/reviews/screenshots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScreenshots(res.data.screenshots);
    } catch (error) {
      toast.error('Failed to fetch screenshots');
    } finally {
      setIsLoading(false);
    }
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl) return toast.error('Please enter a valid YouTube link.');
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return toast.error('Invalid YouTube link format.');

    try {
      const res = await axios.post(
        `${backendUrl}/api/reviews/submit`,
        { videoUrl: youtubeUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('YouTube review submitted!');
        setYoutubeUrl('');
        setYoutubePreview('');
        fetchYoutubeReviews(); // Refresh the list
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Error submitting YouTube link.');
    }
  };

  const handleScreenshotUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image.');
  
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File too large (max 5MB)');
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await axios.post(
        `${backendUrl}/api/reviews/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      );
      
      if (res.data.success) {
        toast.success('Screenshot uploaded!');
        setFile(null);
        setPreviewUrl('');
        fetchScreenshots(); // Refresh the list
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload screenshot.');
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    if (droppedFile) {
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const deleteYoutubeReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this YouTube review?')) return;
    
    try {
      await axios.delete(`${backendUrl}/api/reviews/youtube/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('YouTube review deleted');
      fetchYoutubeReviews();
    } catch (error) {
      toast.error('Failed to delete YouTube review');
    }
  };

  const deleteScreenshot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this screenshot?')) return;
    
    try {
      await axios.delete(`${backendUrl}/api/reviews/screenshots/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Screenshot deleted');
      fetchScreenshots();
    } catch (error) {
      toast.error('Failed to delete screenshot');
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen pt-12 px-4 sm:px-10 lg:px-16">
      <h2 className="text-3xl sm:text-4xl text-center mb-10 font-bold text-yellow-600 drop-shadow-md">
        Admin: Review Management
      </h2>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-3 font-medium ${activeTab === 'upload' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-yellow-500'}`}
        >
          Upload Content
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-6 py-3 font-medium ${activeTab === 'youtube' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-yellow-500'}`}
        >
          YouTube Reviews ({youtubeReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('screenshots')}
          className={`px-6 py-3 font-medium ${activeTab === 'screenshots' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-yellow-500'}`}
        >
          Screenshots ({screenshots.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gray-100 p-8 rounded-xl shadow-md max-w-6xl mx-auto border border-gray-200">
        {activeTab === 'upload' && (
          <div className="space-y-12">
            {/* YouTube Upload */}
            <div>
              <form onSubmit={handleYoutubeSubmit} className="space-y-4">
                <label className="block text-lg font-semibold mb-1">YouTube Link</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    const vid = extractYouTubeId(e.target.value);
                    if (vid) setYoutubePreview(`https://img.youtube.com/vi/${vid}/mqdefault.jpg`);
                    else setYoutubePreview('');
                  }}
                  placeholder="Paste full YouTube URL (Video/Shorts)"
                  className="bg-white text-gray-800 py-3 px-4 rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                {youtubePreview && (
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={youtubePreview}
                      alt="YouTube Preview"
                      className="w-full max-w-xs rounded-lg shadow-md border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setYoutubeUrl('');
                        setYoutubePreview('');
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Clear Preview
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-md font-semibold transition"
                >
                  Submit YouTube Link
                </button>
              </form>
            </div>

            {/* Screenshot Upload */}
            <div>
              <form onSubmit={handleScreenshotUpload} className="space-y-4">
                <label className="block text-lg font-semibold mb-1">Screenshot Upload</label>

                {/* Drag and Drop Area */}
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="w-full p-6 border-2 border-dashed border-gray-400 rounded-lg bg-white text-center hover:border-yellow-500 transition"
                >
                  <p className="text-sm text-gray-500">Drag & drop screenshot here or use the file selector below</p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    if (selectedFile) {
                      setPreviewUrl(URL.createObjectURL(selectedFile));
                    } else {
                      setPreviewUrl('');
                    }
                  }}
                  className="bg-white text-gray-800 py-2 px-4 rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                {previewUrl && (
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={previewUrl}
                      alt="Screenshot Preview"
                      className="w-full max-w-xs rounded-lg border border-yellow-500 shadow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setFile(null);
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Clear Preview
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-md font-semibold transition"
                >
                  Upload Screenshot
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'youtube' && (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : youtubeReviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No YouTube reviews found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {youtubeReviews.map(review => (
                  <div key={review._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                      <iframe
                        src={`https://www.youtube.com/embed/${review.videoId}`}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={review.videoUrl}
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 truncate">{review.videoUrl}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          {new Date(review.submittedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteYoutubeReview(review._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'screenshots' && (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : screenshots.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No screenshots found
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {screenshots.map(screenshot => (
                  <div key={screenshot._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                    <div className="relative">
                      <img
                        src={screenshot.imageUrl}
                        alt="Review screenshot"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => deleteScreenshot(screenshot._id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <span className="text-xs text-gray-500">
                        {new Date(screenshot.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpload;