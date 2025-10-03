import ChromaGrid from '../components/ui/ChromaGrid';

const EventPage = () => {
  const speakerItems = [
    {
      image: "/src/assets/EventSpeakers/Ajitesh Gupta.JPG",
      title: "Ajitesh Gupta",
      subtitle: "",
      handle: "",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Dhruv Soni.JPG",
      title: "Dhruv Soni",
      subtitle: "",
      handle: "",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Harsh Goela.JPG",
      title: "Harsh Goela",
      subtitle: "",
      handle: "",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(145deg, #8B5CF6, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Ranjika Mitra.JPG",
      title: "Ranjika Mitra",
      subtitle: "",
      handle: "",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(145deg, #F59E0B, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Pranjal Kamra.JPG",
      title: "Pranjal Kamra",
      subtitle: "",
      handle: "",
      borderColor: "#EC4899",
      gradient: "linear-gradient(180deg, #EC4899, #000)",
      url: "#"
    },
    {
      image: "/src/assets/EventSpeakers/Vandana Tolani.JPG",
      title: "Vandana Tolani",
      subtitle: "",
      handle: "",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(180deg, #06B6D4, #000)",
      url: "#"
    }
  ];

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
            Our Events
          </h1>
          <div className="w-24 h-1 accent-bg mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Engaging workshops, insightful speaker sessions, and collaborative initiatives that bridge the gap 
            between financial theory and real-world practice.
          </p>
        </div>

        {/* Inviesta Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Inviesta</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
          </div>
          
          <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-accent/20 mb-12">
            <p className="text-lg text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
              <span className="text-accent font-semibold">Inviesta</span> isn't just an annual fest but where ideas come alive and connect with the real world.  
              From thought-provoking speaker sessions that deliver industry insights and career inspiration, to intellectually 
              stimulating competitions that challenge skills in finance, economics and strategy,  
              Inviesta brings together ambition, creativity, and learning under one roof. Blending Miranda  
              House's prestige with interactive formats, it transforms knowledge into capital and growth into  
              return, making it a true celebration of insight, action, and impact.
            </p>
          </div>

          {/* Speaker Grid Section */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Our Past Speakers</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Industry leaders and experts who have shared their knowledge and insights at our events
            </p>
          </div>

          {/* Responsive Speaker Grid Container */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Mobile Fallback Grid */}
            <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-4">
              {speakerItems.map((speaker, index) => (
                <div key={index} className="bg-zinc-900/50 rounded-xl p-4 border border-accent/20 text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2" 
                      style={{ borderColor: speaker.borderColor }}>
                    <img 
                      src={speaker.image} 
                      alt={speaker.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white font-semibold text-sm">{speaker.title}</h4>
                </div>
              ))}
            </div>

            {/* Desktop ChromaGrid */}
            <div className="hidden lg:block h-[800px]">
              <ChromaGrid 
                items={speakerItems}
                radius={250}
                damping={0.5}
                fadeOut={0.7}
                ease="power3.out"
              />
            </div>
          </div>
        </div>

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Workshop Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-cyan-400/20 h-full transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Workshops</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Hands-on sessions designed to build practical financial skills. From stock market basics to 
                advanced investment strategies, our workshops provide the tools and knowledge needed to navigate 
                the financial world with confidence.
              </p>
            </div>
          </div>

          {/* Speaker Sessions Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-blue-400/20 h-full transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🎤</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Speaker Sessions</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Learn from industry experts and seasoned professionals who share their insights and experiences. 
                These sessions offer unique perspectives on finance, investment, and career opportunities in the 
                financial sector.
              </p>
            </div>
          </div>

          {/* Event Image Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-gray-700 h-full">
              <img 
                src="/src/assets/Gallery-Pictures/img7.jpg"
                alt="FICMH Event"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">Upcoming Events</h3>
                <p className="text-gray-300">
                  Stay tuned for our next exciting event. Follow us on social media for updates and announcements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Categories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Event Categories</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Diverse event formats tailored to different learning styles and interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Technical Workshops */}
            <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">📈</div>
              <h3 className="text-xl font-bold text-white mb-3">Technical Workshops</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Deep-dive sessions on technical analysis, trading strategies, and financial modeling for 
                hands-on learning experience.
              </p>
            </div>

            {/* Industry Insights */}
            <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🏢</div>
              <h3 className="text-xl font-bold text-white mb-3">Industry Insights</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Panel discussions and talks from finance professionals sharing real-world experiences and 
                career guidance.
              </p>
            </div>

            {/* Case Competitions */}
            <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
              <h3 className="text-xl font-bold text-white mb-3">Case Competitions</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Competitive events challenging participants to solve real financial problems and present 
                innovative solutions.
              </p>
            </div>

            {/* Networking Events */}
            <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🤝</div>
              <h3 className="text-xl font-bold text-white mb-3">Networking Events</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Opportunities to connect with peers, alumni, and industry professionals in informal 
                settings for meaningful conversations.
              </p>
            </div>
          </div>
        </div>

        {/* Event Stats Section */}
        <div className="bg-black rounded-2xl p-8 border border-accent/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400 text-sm">Events Hosted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">2000+</div>
              <div className="text-gray-400 text-sm">Participants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">25+</div>
              <div className="text-gray-400 text-sm">Industry Speakers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-400 text-sm">Partner Organizations</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-zinc-500/10 to-blue-500/10 rounded-2xl p-8 border border-accent/20">
            <h3 className="text-2xl font-bold text-white mb-4">Want to stay updated?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Follow us on social media and join our mailing list to get notified about upcoming events, 
              workshops, and opportunities.
            </p>
            <button className="accent-bg primary-text px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventPage;