import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { verifySession, selectLoginState } from '../features/authentication/session/sessionSlice';
import NavigationMenu from '../components/navigationMenu/NavigationMenu';
import LandingPage from '../views/LandingPage/LandingPage';
import Store from '../views/Store/Store';
import MyAccount from '../views/MyAccount/MyAccount';
import Authentication from '../views/Authentication/Authentication';
import Administration from '../views/Administration/Administration';
import Pages from '../views/Pages/Pages';
import Footer from '../components/Footer';
import './App.css';

function App() {

  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoginState);

  useEffect(() => {
    if (loggedIn) {
      dispatch(verifySession());
    }
  }, [dispatch,loggedIn]);

  return (
    <>
      <NavigationMenu />
      <main className="pb-5 flex-grow-1 container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/store/*" element={<Store />} />
          <Route path="/my/*" element={<MyAccount />} />
          <Route path="/auth/*" element={<Authentication />} />
          <Route path="/admin/*" element={<Administration />} />
          <Route path="/*" element={<Pages />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
