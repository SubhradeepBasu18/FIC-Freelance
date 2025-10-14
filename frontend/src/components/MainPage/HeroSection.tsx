
const HeroSection = () => {
  return (
    <section className="relative bg-black">
      {/* Background Image Section */}
      <div className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/HomePageGroupPhoto/home_page_photo.jpg"
            alt="FICMH Team Photo"
            className="w-full h-full object-cover object-top"
          />
          {/* Enhanced gradient overlay for smoother blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black"></div>
          <div className="absolute bottom-0 h-1/3 w-full bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
        </div>

        {/* Text Content Over Photo - Positioned at Bottom */}
        <div className="relative z-10 w-full pb-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-7xl md:text-9xl font-bold mb-6 tracking-widest drop-shadow-2xl 
                  text-white">
              FIC<span className="text-cyan-400">MH</span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
            {/* <p className="text-transparent italic text-3xl md:text-4xl font-light 
                  [text-stroke:1px_#facc15] [-webkit-text-stroke:1px_#facc15] drop-shadow-lg">
              Cultivating financial literacy, empowering young minds
            </p> */}
          </div>
        </div>
      </div>

      {/* Our Team Section - Better integration */}
      <div className="relative py-20 px-6 -mt-20">
        {/* Background that seamlessly continues from the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-black/90 backdrop-blur-2xl rounded-3xl border border-cyan-400/20 p-10 shadow-2xl shadow-cyan-400/10 hover:shadow-cyan-400/20 transition-all duration-500">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 px-6 py-3 rounded-full border border-cyan-400/20 mb-4">                
                <h3 className="text-3xl font-bold text-white">Our Team</h3>
              </div>
            </div>
            <p className="text-gray-200 text-xl leading-relaxed text-center font-light">
              The passionate minds behind <span className="text-cyan-400 font-semibold">FICMH's</span> vision to transform financial education and empower the next generation of leaders through innovative learning experiences.
            </p>
            
            {/* Additional decorative elements */}
            <div className="flex justify-center mt-6">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;