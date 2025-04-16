import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import {ShopContext} from '../context/ShopContext.jsx'

const YouTubeReviews = () => {
    const {token} = useContext(ShopContext);
  const [link, setLink] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(''); // to store the clicked video URL

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/reviews/all');
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') {
      return url;
    }
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractYouTubeId(link);
    if (!videoId) return toast.error('Invalid YouTube link.');
  
    try {
      const res = await axios.post('http://localhost:4000/api/reviews/submit', { videoUrl: link } , {headers : {token}});
      if (res.data.success) {
        toast.success('Review submitted!');
        setLink('');
        fetchReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    }
  };

  const openModal = (url) => {
    setVideoUrl(url); // Set the URL of the clicked video
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-[80vh] border-t pt-10 px-4 sm:px-8 lg:px-16 bg-[#121212] text-yellow-100">
      <div className="text-2xl sm:text-3xl mb-6 text-center">
        <Title text1="YOUTUBE " text2="REVIEWS" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-10"
      >
        <input
          type="url"
          required
          placeholder="Enter YouTube video link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md text-black bg-white placeholder-gray-500 shadow"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-400 transition"
        >
          Submit
        </button>
      </form>

      {/* Thumbnails */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => {
            console.log(review)
          const videoId = extractYouTubeId(review.videoUrl);
          return (
            <div
              key={i}
              className="bg-[#1b1b1b] rounded-lg overflow-hidden border border-white/10 shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => openModal(review.videoUrl)} // Open modal on thumbnail click
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="YouTube Thumbnail"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-sm text-yellow-200">
                Review by: {review.userName || 'Anonymous'}
              </div>
            </div>
          );
        })}
      </div>
        {/* Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 bg-black opacity-100 flex justify-center items-center z-50"> {/* Overlay with less opacity */}
            <div className="bg-[#121212] p-4 rounded-lg w-full sm:w-3/4 lg:w-2/3 opacity-100"> {/* Video player with full opacity */}
            <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-xl font-bold"
            >
                &times;
            </button>
            <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            </div>
        </div>
        )}

    </div>
  );
};

export default YouTubeReviews;
