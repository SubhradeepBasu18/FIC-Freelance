const AboutPage = () => {
  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
            About FICMH
          </h1>
          <div className="w-24 h-1 accent-bg mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The Finance and Investment Club of Miranda House - where financial literacy meets innovation, 
            and young minds shape the future of finance.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Mission Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-cyan-400/20 h-full transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Our mission is to foster financial literacy, critical thinking, and real-world awareness among students 
                by creating opportunities to learn, engage, and apply knowledge. Guided by our motto 
                <span className="text-accent font-semibold"> "Insight, Action, Impact,"</span> we strive to bridge 
                the gap between classroom concepts and practical applications through workshops, speaker sessions, 
                and collaborative initiatives.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-blue-400/20 h-full transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🔭</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                We envision FIC Miranda House as a dynamic platform that empowers students to become informed, 
                responsible, and future-ready individuals. With the belief that we are 
                <span className="text-accent font-semibold"> "Fueling Futures Through Finance,"</span> the club 
                aspires to nurture curiosity, inspire innovation, and build a community where financial knowledge 
                translates into meaningful change.
              </p>
            </div>
          </div>

          {/* Image Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-gray-700 h-full">
              <img 
                src="/assets/HomePageGroupPhoto/home_page_photo.jpg"
                alt="FICMH Team"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">Our Community</h3>
                <p className="text-gray-300">
                  A diverse group of passionate students driving financial awareness and innovation at Miranda House.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Departments Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Departments</h2>
            <div className="w-20 h-1 accent-bg mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Four specialized teams working together to drive financial literacy and innovation forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Social Media and Design */}
            <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">✨</div>
              <h3 className="text-xl font-bold text-white mb-3">Social Media & Design</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The creative hub managing digital presence, curating engaging content, and designing visuals that 
                amplify the club's voice across platforms with clarity and impact.
              </p>
            </div>

            {/* Research and Editorial */}
            <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Research & Editorial</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The analytical backbone producing well-researched articles and reports that simplify complex financial 
                concepts with accuracy and insight.
              </p>
            </div>

            {/* Logistics and Sponsorship */}
            <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Logistics & Sponsorship</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Responsible for seamless event execution, coordinating operations, and forging partnerships to ensure 
                professional delivery of all initiatives.
              </p>
            </div>

            {/* Public Relations and Marketing */}
            <div className="group bg-zinc-950 p-6 rounded-xl border border-gray-700 hover:border-accent/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🌐</div>
              <h3 className="text-xl font-bold text-white mb-3">PR & Marketing</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Building meaningful connections with stakeholders through outreach and promotions, ensuring club 
                initiatives resonate with both students and industry.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-black rounded-2xl p-8 border border-accent/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">2021</div>
              <div className="text-gray-400 text-sm">Established</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">4</div>
              <div className="text-gray-400 text-sm">Departments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400 text-sm">Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-400 text-sm">Students Impacted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;