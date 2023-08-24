import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AttributionInfo from './AttributionInfo';
import PageNotFound from './PageNotFound';

function Pages() {
  return (
    <Routes>
      <Route path="/attribution-info" element={<AttributionInfo />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Pages;