import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const AdminUpload = ({ token }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState(null);

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl) return toast.error('Please enter a valid YouTube link.');

    try {
      const res = await axios.post(
        backendUrl + '/api/reviews/submit', 
        { videoUrl: youtubeUrl },
        { headers: { Authorization : `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success('YouTube review submitted!');
        setYoutubeUrl('');
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

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(
        backendUrl + '/api/reviews/upload-image', 
        formData,
        { headers: { Authorization : `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        toast.success('Screenshot uploaded!');
        setFile(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to upload screenshot.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-12 px-6 sm:px-10 lg:px-16">
      <h2 className="text-3xl sm:text-4xl text-center mb-8 font-semibold">Admin: Upload Review</h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <form onSubmit={handleYoutubeSubmit} className="flex flex-col sm:flex-row gap-6 mb-8">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Enter YouTube Link"
            className="bg-gray-700 text-white py-3 px-4 rounded-md shadow-md w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button type="submit" className="bg-yellow-600 text-black px-8 py-3 rounded-md hover:bg-yellow-500 transition">
            Submit YouTube Link
          </button>
        </form>

        <form onSubmit={handleScreenshotUpload} className="flex flex-col sm:flex-row gap-6">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-gray-700 text-white py-3 px-4 rounded-md shadow-md w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button type="submit" className="bg-yellow-600 text-black px-8 py-3 rounded-md hover:bg-yellow-500 transition">
            Upload Screenshot
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpload;