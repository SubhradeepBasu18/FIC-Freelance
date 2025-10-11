// MissionValue.tsx
import { Sparkles, Target } from "lucide-react";

const MissionVisionSection = () => {
  return (
    <section className="relative px-6 py-20 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-blue-500"></div>
              
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-400/20 p-3 rounded-xl">
                    <Target className="text-blue-400" size={32} />
                  </div>
                  <h3 className="text-4xl font-bold text-white">Mission</h3>
                </div>
                
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  Our mission is to foster financial literacy, critical thinking, and real-world awareness among students 
                  by creating opportunities to learn, engage, and apply knowledge.
                </p>
                
                <div className="bg-gradient-to-br from-blue-400/10 to-blue-500/10 p-6 rounded-xl border border-blue-400/20">
                  <p className="text-blue-400 text-xl font-semibold italic text-center">
                    "Insight. Action. Impact."
                  </p>
                </div>
                
                <p className="text-gray-300 mt-6 leading-relaxed">
                  We strive to bridge the gap between classroom concepts and practical applications through workshops, 
                  speaker sessions, and collaborative initiatives.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-400/20 p-3 rounded-xl">
                    <Sparkles className="text-blue-400" size={32} />
                  </div>
                  <h3 className="text-4xl font-bold text-white">Vision</h3>
                </div>
                
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  We envision FIC Miranda House as a dynamic platform that empowers students to become informed, 
                  responsible, and future-ready individuals.
                </p>
                
                <div className="bg-gradient-to-br from-blue-400/10 to-blue-500/10 p-6 rounded-xl border border-blue-400/20">
                  <p className="text-blue-400 text-xl font-semibold italic text-center">
                    "Fueling Futures Through Finance"
                  </p>
                </div>
                
                <p className="text-gray-300 mt-6 leading-relaxed">
                  The club aspires to nurture curiosity, inspire innovation, and build a community where financial 
                  knowledge translates into meaningful change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;