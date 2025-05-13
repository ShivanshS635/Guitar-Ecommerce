import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = lazy(() => import('./pages/Home'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Collection = lazy(() => import('./pages/Collection'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Product = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const Orders = lazy(() => import('./pages/Orders'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ForgotPassword = lazy (() => import( './pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

const App = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-26 bg-[#0d0d0d] min-h-screen">
        <ToastContainer />
        <main className="max-w-[1440px] w-full mx-auto px-4">
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400"></div>
              <p className="ml-4">Loading...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element = {<ResetPassword/>}/>
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="*" element={
                <div className="text-center py-20 text-red-400 text-xl">
                  <p>404 | Page Not Found</p>
                  <a href="/" className="text-blue-400 underline">Go back to Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
