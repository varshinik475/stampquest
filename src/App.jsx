import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PassportPage from './pages/PassportPage';
import StampsPage from './pages/StampsPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import MapPage from './pages/MapPage';
import Achievements from './pages/Achievements';
import MotionDemoPage from './pages/MotionDemoPage';
import { Chat } from './components/Chat';

const PassportOrbitPage = lazy(() => import('./pages/PassportOrbitPage'));

function App() {
  return (
    <TravelProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/passport" element={<PassportPage />} />
          <Route path="/stamps" element={<StampsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/motion-lab" element={<MotionDemoPage />} />
          <Route path="/passport-orbit" element={<Suspense fallback={<div className="orbit-loading">Loading passport orbit...</div>}><PassportOrbitPage /></Suspense>} />
          <Route path="/chat" element={<section className="chat-page" aria-label="AI travel guide"><Chat /></section>} />
        </Routes>
      </Layout>
    </TravelProvider>
  );
}

export default App;
