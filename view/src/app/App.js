import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigationMenu from '../components/NavigationMenu';
import LandingPage from '../views/LandingPage/LandingPage';
import Store from '../views/Store/Store';
import MyAccount from '../views/MyAccount/MyAccount';
import Authentication from '../views/Authentication/Authentication';
import Administration from '../views/Administration/Administration';
import Pages from '../views/Pages/Pages';

function App() {
  return (
    <div>
      <NavigationMenu />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/store/*" element={<Store />} />
          <Route path="/my/*" element={<MyAccount />} />
          <Route path="/auth/*" element={<Authentication />} />
          <Route path="/admin/*" element={<Administration />} />
          <Route path="/*" element={<Pages />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
