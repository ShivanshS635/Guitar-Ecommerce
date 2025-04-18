import React from 'react'
import Hero from '../components/home/Hero.jsx'
import CategoryHighlights from '../components/home/CategoryHighlights.jsx'
import Craftsmanship from '../components/home/Craftsmanship.jsx'
import YouTubeReviews from '../components/home/YouTubeReviews.jsx'
import ScreenshotGallery from '../components/home/ScreenshotGallery.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import LatestProducts from '../components/LatestCategories.jsx'

const Home = () => (
  <>
    <Hero />
    <CategoryHighlights />
    <Craftsmanship />
    <LatestProducts/>
    <YouTubeReviews />
    <ScreenshotGallery />
    <Testimonials />
  </>
)

export default Home