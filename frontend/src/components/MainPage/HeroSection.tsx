import React from 'react';
import { Sparkles, TrendingUp, Target, MessageSquare } from 'lucide-react';

// Hero Section Component
const HeroSection = () => {
    return (
      <section className="relative bg-black">
        {/* Background Image Section */}
        <div className="relative min-h-screen flex items-end overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/src/assets/HomePageGroupPhoto/home_page_photo.jpg"
              alt="FICMH Team Photo"
              className="w-full h-full object-cover object-top"
            />
            {/* Lighter overlay to show faces better */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>
          </div>
          
          {/* Text Content Over Photo - Positioned at Bottom */}
          <div className="relative z-10 w-full pb-20 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                FIC<span className="text-cyan-400">MH</span>
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
              <p className="text-yellow-400 italic text-3xl md:text-4xl font-light drop-shadow-lg">
                Cultivating financial literacy, empowering young minds
              </p>
            </div>
          </div>
        </div>
  
        {/* Our Team Section - Below Photo */}
        <div className="relative py-16 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-cyan-400/30 p-8 shadow-2xl">
              <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-4">
                <Sparkles className="text-cyan-400" size={32} />
                Our Team
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                The passionate minds behind FICMH's vision to transform financial education and empower the next generation of leaders.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

export default HeroSection;
