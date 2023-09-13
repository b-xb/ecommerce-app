import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './Login';
import PageNotFound from '../Pages/PageNotFound';
import Register from './Register';
import RegistrationSuccessful from './RegistrationSuccessful';

function Authentication() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/registrationSuccessful" element={<RegistrationSuccessful />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Authentication;
