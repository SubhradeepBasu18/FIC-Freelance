const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden"
    >
      {/* Foreground content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left side (text) */}
        <div id="about-text" className="space-y-8 text-left">
          <h2 className="text-4xl sm:text-5xl font-bold italic text-white">
            About FICMH
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-lg sm:text-xl text-light leading-relaxed">
                Established in 2021, the Finance and Investment Club of Miranda House is a student-led initiative 
                that seeks to cultivate financial literacy and awareness among young minds. By hosting interactive 
                workshops, thought-provoking speaker sessions, and engaging events, the club strives to bridge the 
                gap between theory and practice while making finance more accessible and relevant.
              </p>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-lg border-l-4 accent-text">
              <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-light leading-relaxed">
                Our mission is to foster financial literacy, critical thinking, and real-world awareness among students 
                by creating opportunities to learn, engage, and apply knowledge. Guided by our motto <span className="accent-text font-semibold">"Insight. Action. Impact."</span>, 
                we strive to bridge the gap between classroom concepts and practical applications through workshops, 
                speaker sessions, and collaborative initiatives.
              </p>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-lg border-l-4 accent-text">
              <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-light leading-relaxed">
                We envision FIC Miranda House as a dynamic platform that empowers students to become informed, 
                responsible, and future-ready individuals. With the belief that we are <span className="accent-text font-semibold">"Fueling Futures Through Finance,"</span> 
                the club aspires to nurture curiosity, inspire innovation, and build a community where financial 
                knowledge translates into meaningful change.
              </p>
            </div>

            <div>
              <p className="text-lg text-light leading-relaxed font-medium">
                With each endeavor, FICMH continues to inspire students to think critically, explore new perspectives, 
                and engage meaningfully with the evolving world of finance and economics.
              </p>
            </div>
          </div>
        </div>

        {/* Right side (placeholder for image/visual) */}
        <div id="about-visual" className="flex justify-center md:justify-end">
          <div className="w-full max-w-md h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-cyan-400/30">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-white mb-2">FICMH</h3>
              <p className="accent-text font-semibold">Finance & Investment Club</p>
              <p className="text-light mt-2">Miranda House</p>
              <p className="text-gray-400 text-sm mt-4">Est. 2021</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;