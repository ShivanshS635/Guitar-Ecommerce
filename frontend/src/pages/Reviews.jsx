import React from 'react';
import YouTubeReview from '../components/YoutubeReview.jsx';
import ReviewScreenshots from '../components/ReviewScreenshots.jsx';
import Title from '../components/Title.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import TextReviewList from '../components/TextReviewList.jsx';

const Reviews = () => {
  return (
    <div className="pt-12 px-4 sm:px-8 lg:px-16 text-yellow-100">
      <Title text1={'CUSTOMER '} text2={'REVIEWS'}/>
      <YouTubeReview />
      <ReviewScreenshots />
      <TextReviewList/>
      <ReviewForm/>
    </div>
  );
};

export default Reviews;
