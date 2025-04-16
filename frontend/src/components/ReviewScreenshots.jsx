import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const ReviewScreenshots = () => {
  const { token , backendUrl } = useContext(ShopContext);
  const [file, setFile] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(
        backendUrl + '/api/reviews/upload-image',
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        toast.success('Screenshot uploaded!');
        setFile(null);
        fetchScreenshots();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload screenshot.');
    }
  };

  const fetchScreenshots = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/reviews/screenshots');
      setScreenshots(res.data.screenshots || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchScreenshots();
  }, []);

  return (
    <div className="pt-12 px-4 sm:px-8 lg:px-16 text-yellow-100">
      <h2 className="text-2xl sm:text-3xl text-center mb-6 font-semibold">Review Screenshots</h2>

      <form
        onSubmit={handleUpload}
        className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-10"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="bg-white text-black py-2 px-3 rounded-md shadow w-full"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-400 transition"
        >
          Upload
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {screenshots.map((ss, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden border border-white/10 shadow"
          >
            <img
              src={ss.imageUrl}
              alt={`screenshot-${i}`}
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewScreenshots;