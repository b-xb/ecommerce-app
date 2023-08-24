import React from 'react';
import { Navigate } from 'react-router-dom';

function LandingPage() {
  return (
    <Navigate to="/store" replace={true} />
  );
}

export default LandingPage;