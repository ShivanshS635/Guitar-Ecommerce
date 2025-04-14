// src/components/OrderSuccessOverlay.jsx
import React from 'react';
import Lottie from 'lottie-react';
import Confetti from 'react-confetti';
import successAnimation from '../assets/order-success.json';

const OrderSuccessOverlay = () => {
  return (
    <div style={overlayStyles}>
      <Confetti />
      <div style={contentStyles}>
        <Lottie animationData={successAnimation} loop={false} style={{ width: 200, height: 200 }} />
        <h2 style={textStyles}>Order Confirmed!</h2>
      </div>
    </div>
  );
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyles = {
  textAlign: 'center',
  color: '#fff',
};

const textStyles = {
  marginTop: 20,
};

export default OrderSuccessOverlay;
