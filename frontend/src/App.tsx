import React from "react";
import HeroSection from "./components/HeroSection";
import Header from "./components/Header";
import AboutSection from "./components/About";


const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Fixed header on top */}
      <Header />

      {/* Main content with responsive padding */}
      <main className="flex-1 relative z-10 px-4 sm:px-6 lg:px-12">
        <HeroSection />
        <AboutSection />
        {/* Add more sections here */}
      </main>

      {/* Example responsive footer (optional) */}
      <footer className="py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} My Website. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
