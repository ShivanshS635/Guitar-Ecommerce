import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const AdminUpload = ({ token }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [youtubePreview, setYoutubePreview] = useState('');

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
        `${backendUrl}/api/reviews/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (res.data.success) {
        toast.success('Screenshot uploaded!');
        setFile(null);
        setPreviewUrl('');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to upload screenshot.');
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

  return (
    <div className="bg-white text-gray-800 min-h-screen pt-12 px-4 sm:px-10 lg:px-16">
      <h2 className="text-3xl sm:text-4xl text-center mb-10 font-bold text-yellow-600 drop-shadow-md">
        Admin: Upload Review
      </h2>

      <div className="bg-gray-100 p-8 rounded-xl shadow-md max-w-3xl mx-auto space-y-12 border border-gray-200">
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
    </div>
  );
};

export default AdminUpload;
