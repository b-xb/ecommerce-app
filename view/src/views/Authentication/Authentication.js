import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './Login';
import PageNotFound from '../Pages/PageNotFound';
import Logout from './Logout';
import Register from './Register';

function Authentication() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Authentication;
