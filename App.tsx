
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Questionnaire from './pages/Questionnaire';
import ArtistQuestionnaire from './pages/ArtistQuestionnaire';
import ClientFeedback from './pages/ClientFeedback';
import ResumeDraft from './pages/ResumeDraft';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
          <Route path="resume/:token" element={<ResumeDraft />} />
          <Route path="resume" element={<ResumeDraft />} />
          <Route path="valutazione-servizio" element={<ClientFeedback />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};


export default App;
