// components/YouTubeReviews.jsx
import React from 'react';
import ReactPlayer from 'react-player';

const videos = [
  { url: 'https://youtu.be/0gvohVn8A_w?si=W6ySRep-5AIbxzFx', title: 'Review by Musician A' },
  { url: 'https://youtu.be/EfdNBzH6QPk?si=_8v42stzbV5HFZFU', title: 'Review by Musician B' },
];

const YouTubeReviews = () => (
  <section className="bg-zinc-950 py-16 px-6 text-white">
    <h2 className="text-3xl text-yellow-400 font-bold mb-8 text-center">What Musicians Are Saying</h2>
    <div className="flex flex-wrap justify-center gap-8">
      {videos.map((video, i) => (
        <div key={i} className="w-full md:w-1/2 lg:w-1/3 ::contentReference[oaicite:0]{index=0}">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <ReactPlayer
              url={video.url}
              controls
              width="100%"
              height="100%"
              style={{ borderRadius: '12px' }}
            />
          </div>
          <p className="mt-3 text-center text-gray-300">{video.title}</p>
        </div>
      ))}
    </div>
  </section>
);

export default YouTubeReviews;
