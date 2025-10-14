import { MessageSquare } from "lucide-react";
// ADD CONVENOR"S IMAGE IN LINE 57

const ConvenorNoteSection = () => {
  return (
    <section className="relative px-6 py-20 bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Convenor's <span className="text-blue-400">Note</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Text Content Card */}
          <div className="lg:w-2/3 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-700"></div>
            <div className="relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
              
              <div className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-blue-400/20 p-4 rounded-xl flex-shrink-0">
                    <MessageSquare className="text-blue-400" size={36} />
                  </div>
                  <div>
                    <p className="text-gray-200 text-lg md:text-xl leading-relaxed italic">
                      "Financial independence and intelligent investments are hallmarks of a dignified life. These traits are conventionally attached to a certain group of men in a patriarchal society. At Miranda House, we are breaking these barriers, one step at a time, with the Finance and Investment Club (FIC). We not only ensure financial and investment awareness among the students but also prepare them as they venture out into the world of employment. We provide a platform to connect and clear their doubts on finance and investment. The workshops and interactive sessions by FIC have given ample opportunities for students to gain exposure in these matters. We are constantly collaborating with established institutions to enrich this learning curve"
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-zinc-800/50 px-6 py-3 rounded-xl border border-blue-400/20">
                    <p className="text-blue-400 font-semibold text-lg">— Rashmi Gopi</p>
                    <p className="text-gray-400 text-sm text-center">Convenor, FICMH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Convenor Image - Outside the card */}
          <div className="lg:w-1/3 flex justify-center">
            <div className="relative group">
              {/* Outer glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
              
              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-full border-2 border-blue-400/30 shadow-2xl shadow-blue-400/10 group-hover:shadow-blue-400/20 transition-all duration-500">
                {/* Image with round frame */}
                <div className="relative overflow-hidden rounded-full w-72 h-72 border-4 border-blue-400/20 group-hover:border-blue-400/40 transition-all duration-500">
                  <img
                    src="../../assets/ConvenorPic.png"
                    alt="Rashmi Gopi - Convenor"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-full"></div>
                </div>
                
                {/* Decorative rings */}
                <div className="absolute -inset-2 border-2 border-blue-400/10 rounded-full group-hover:border-blue-400/20 transition duration-500"></div>
                <div className="absolute -inset-4 border border-blue-400/5 rounded-full"></div>
                
                {/* Floating name badge */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-400/10 to-blue-600/10 backdrop-blur-xl px-6 py-3 rounded-full border border-blue-400/30 shadow-lg">
                    <p className="text-blue-400 font-bold text-lg whitespace-nowrap">Rashmi Gopi</p>
                    <p className="text-gray-300 text-sm text-center">Convenor</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400/20 rounded-full blur-sm"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400/30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Additional decorative element */}
        <div className="flex justify-center mt-16">
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default ConvenorNoteSection;