// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "@/components/ui/Layout";
import MainPage from "./pages/MainPage";
import About from "@/pages/AboutPage";
import Events from "@/pages/EventPage";
import Gallery from "@/pages/GalleryPage";
import Sponsors from "@/pages/Sponsors";
import AdminDashboard from "@/pages/Admin-Dashboard";
import SignInPage from '@/pages/SignInPage';
import ResetPassword from '@/pages/ResetPassword';
import Publications from '@/pages/Publications';
import ArticlesPage from '@/components/PublicationsPage/Article';
import NewslettersPage from '@/components/PublicationsPage/Newsletter';
import PodcastsPage from '@/components/PublicationsPage/Podcast';
import JournalsPage from '@/components/PublicationsPage/Journal';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/newsletter" element={<NewslettersPage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/journals" element={<JournalsPage />} />
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-cyan-400 mb-4">404</h1>
        <p className="text-2xl text-gray-300">Page not found</p>
      </div>
    </div>
  );
};

export default App;