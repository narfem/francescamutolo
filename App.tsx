
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Questionnaire from './pages/Questionnaire';
import ArtistQuestionnaire from './pages/ArtistQuestionnaire';
import ClientFeedback from './pages/ClientFeedback';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.substring(1);
      navigate(cleanPath, { replace: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="questionario" element={<Questionnaire />} />
          <Route path="questionario-artista" element={<ArtistQuestionnaire />} />
          <Route path="identita-artistica" element={<ArtistQuestionnaire />} />
          <Route path="valutazione-servizio" element={<ClientFeedback />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};


export default App;
