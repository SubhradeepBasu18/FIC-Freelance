import { MessageSquare } from "lucide-react";

const ConvenorNoteSection = () => {
    return (
      <section className="relative px-6 py-20 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Convenor <span className="text-yellow-400">Note</span>
            </h2>
          </div>
  
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-700"></div>
            <div className="relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
              
              <div className="p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-yellow-400/20 p-4 rounded-xl">
                    <MessageSquare className="text-yellow-400" size={36} />
                  </div>
                  <div>
                    <p className="text-gray-200 text-xl leading-relaxed italic">
                      "With each endeavor, FICMH continues to inspire students to think critically, explore new perspectives, 
                      and engage meaningfully with the evolving world of finance and economics."
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-zinc-800/50 px-6 py-3 rounded-xl border border-yellow-400/20">
                    <p className="text-yellow-400 font-semibold text-lg">— The FICMH Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export default ConvenorNoteSection;
