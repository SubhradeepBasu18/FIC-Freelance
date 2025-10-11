import React from 'react';
import { Sparkles, TrendingUp, Target, MessageSquare } from 'lucide-react';

const AboutSection = () => {
    return (
      <section className="relative px-6 py-20 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 relative">
                About <span className="text-cyan-400">FICMH</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </h2>
            </div>
            <p className="text-gray-400 text-lg mt-6 max-w-3xl mx-auto">
              A journey that began in 2021, transforming financial education
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10">
                <p className="text-gray-200 text-lg leading-relaxed">
                  Established in 2021, the Finance and Investment Club of Miranda House is a student-led initiative 
                  that seeks to cultivate financial literacy and awareness among young minds.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10">
                <p className="text-gray-200 text-lg leading-relaxed">
                  By hosting interactive workshops, thought-provoking speaker sessions, and engaging events, the club 
                  strives to bridge the gap between theory and practice while making finance more accessible and relevant.
                </p>
              </div>
            </div>
  
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-zinc-800/50 backdrop-blur-xl p-10 rounded-2xl border border-cyan-400/30">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-400/10 p-3 rounded-lg">
                      <TrendingUp className="text-cyan-400" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Interactive Learning</h4>
                      <p className="text-gray-400">Workshops and practical sessions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-400/10 p-3 rounded-lg">
                      <Target className="text-cyan-400" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Real-World Focus</h4>
                      <p className="text-gray-400">Bridging theory and practice</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-400/10 p-3 rounded-lg">
                      <MessageSquare className="text-cyan-400" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Expert Insights</h4>
                      <p className="text-gray-400">Speaker sessions with industry leaders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export default AboutSection;
