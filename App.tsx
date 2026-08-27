
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Questionnaire from './pages/Questionnaire';
import ArtistQuestionnaire from './pages/ArtistQuestionnaire';
import ClientFeedback from './pages/ClientFeedback';
import Reviews from './pages/Reviews';
import PortfolioCategoryPage from './pages/PortfolioCategoryPage';
import PsychologistsLanding from './pages/PsychologistsLanding';
import NutritionistsLanding from './pages/NutritionistsLanding';

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
          <Route path="portfolio" element={<Navigate to="/" replace />} />
          <Route path="portfolio/branding" element={<PortfolioCategoryPage categoryKey="branding" />} />
          <Route path="portfolio/flyer-poster" element={<PortfolioCategoryPage categoryKey="flyer-poster" />} />
          <Route path="portfolio/social-media" element={<PortfolioCategoryPage categoryKey="social-media" />} />
          <Route path="portfolio/web" element={<PortfolioCategoryPage categoryKey="web" />} />
          <Route path="portfolio/:categorySlug" element={<PortfolioCategoryPage />} />
          <Route path="psicologi" element={<PsychologistsLanding />} />
          <Route path="nutrizionisti" element={<NutritionistsLanding />} />
          <Route path="recensioni" element={<Reviews />} />
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
