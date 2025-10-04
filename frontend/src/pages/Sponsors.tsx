import ChromaGrid from '../components/ui/ChromaGrid';

// Import all sponsor images
import ChaseProtein from '../assets/Collaborations/Chase Protein.png';
import Crowwd from '../assets/Collaborations/Crowwd.png';
import EvePaper from '../assets/Collaborations/EvePaper.png';
import GLBXTNT from '../assets/Collaborations/GLBXTNT.png';
import HDFC from '../assets/Collaborations/HDFC.png';
import LazerCrazer from '../assets/Collaborations/Lazer Crazer.png';
import Unstop from '../assets/Collaborations/Unstop.png';

const SponsorsPage = () => {
  const sponsorItems = [
    {
      image: ChaseProtein,
      title: "Chase Protein",
      subtitle: "",
      handle: "",
      borderColor: "#E5E7EB",
      gradient: "linear-gradient(145deg, #E5E7EB, #000)",
      url: "#"
    },
    {
      image: Crowwd,
      title: "Crowwd",
      subtitle: "",
      handle: "",
      borderColor: "#FBBF24",
      gradient: "linear-gradient(145deg, #FBBF24, #000)",
      url: "#"
    },
    {
      image: EvePaper,
      title: "EvePaper",
      subtitle: "",
      handle: "",
      borderColor: "#9CA3AF",
      gradient: "linear-gradient(145deg, #9CA3AF, #000)",
      url: "#"
    },
    {
      image: GLBXTNT,
      title: "GLBXTNT",
      subtitle: "",
      handle: "",
      borderColor: "#10B981",
      gradient: "linear-gradient(145deg, #10B981, #000)",
      url: "#"
    },
    {
      image: HDFC,
      title: "HDFC",
      subtitle: "",
      handle: "",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "#"
    },
    {
      image: LazerCrazer,
      title: "Lazer Crazer",
      subtitle: "",
      handle: "",
      borderColor: "#EC4899",
      gradient: "linear-gradient(145deg, #EC4899, #000)",
      url: "#"
    },
    {
      image: Unstop,
      title: "Unstop",
      subtitle: "",
      handle: "",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(145deg, #8B5CF6, #000)",
      url: "#"
    }
  ];

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
            Our Partners
          </h1>
          <div className="w-24 h-1 accent-bg mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're proud to collaborate with visionary organizations that share our commitment to 
            financial education and empowerment. Together, we're building the next generation of financial leaders.
          </p>
        </div>

        {/* Current Sponsors Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Current Partners</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Organizations currently supporting our mission and events
            </p>
          </div>

          {/* Responsive Sponsor Grid Container */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Mobile Fallback Grid */}
            <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-6">
              {sponsorItems.map((sponsor, index) => (
                <div key={index} className="bg-zinc-900/50 rounded-xl p-6 border border-accent/20 text-center group hover:border-accent/40 transition-all duration-300">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden bg-white/5 p-3 flex items-center justify-center">
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-1">{sponsor.title}</h4>
                  <p className="text-accent text-sm">{sponsor.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Desktop ChromaGrid */}
            <div className="hidden lg:block h-[800px]">
              <ChromaGrid 
                items={sponsorItems}
                radius={200}
                damping={0.5}
                fadeOut={0.7}
                ease="power3.out"
              />
            </div>
          </div>
        </div>

        {/* Why Partner With Us */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 border border-accent/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Partner With Us?</h2>
              <div className="w-20 h-1 accent-bg mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Targeted Audience</h3>
                <p className="text-gray-300">
                  Reach ambitious students from Miranda House, University of Delhi, known for academic excellence and leadership potential.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Brand Visibility</h3>
                <p className="text-gray-300">
                  Get featured across our digital platforms, event materials, and social media reaching 10,000+ students.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Talent Acquisition</h3>
                <p className="text-gray-300">
                  Connect with top talent for internships and placements from one of India's premier educational institutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Stats */}
        <div className="bg-black rounded-2xl p-8 border border-accent/20 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400 text-sm">Past Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Student Reach</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">25+</div>
              <div className="text-gray-400 text-sm">Events Yearly</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400 text-sm">Partner Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-zinc-500/10 to-green-500/10 rounded-2xl p-8 border border-accent/20">
            <h3 className="text-2xl font-bold text-white mb-4">Interested in Partnering With Us?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can create meaningful impact together. Reach out to our partnership team 
              to explore collaboration opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="accent-bg primary-text px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
                Download Sponsorship Deck
              </button>
              <button className="border border-accent text-accent px-8 py-3 rounded-lg font-semibold hover:bg-accent hover:text-black transition-all duration-300">
                Contact Partnership Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsPage;