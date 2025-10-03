// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "@/components/ui/Layout";
import MainPage from "./pages/MainPage";
import About from "@/pages/AboutPage";
import Events from "@/pages/Events";
import Gallery from "@/pages/GalleryPage";
import Schedule from "@/pages/Schedule";
import AdminDashboard from "./pages/Admin-Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
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